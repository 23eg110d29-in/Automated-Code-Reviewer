const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { getGroqModel, DEFAULT_MODEL } = require('../config/groq');
const Trace = require('../models/Trace');

process.env.LANGCHAIN_TRACING_V2 = process.env.LANGCHAIN_TRACING_V2 || process.env.LANGSMITH_TRACING || 'false';
process.env.LANGSMITH_TRACING = process.env.LANGSMITH_TRACING || process.env.LANGCHAIN_TRACING_V2;
process.env.LANGCHAIN_PROJECT = process.env.LANGCHAIN_PROJECT || 'Automated-Code-Reviewer';

const estimateTokens = (text) => {
  if (!text) return 0;
  const words = text.trim().split(/\s+/).length;
  // rough heuristic: 1 token ~= 0.75 words
  return Math.max(1, Math.ceil(words / 0.75));
};

const reviewPrompt = ChatPromptTemplate.fromMessages([
  ['system', `You are a professional senior software engineer and code reviewer.

Analyze the provided code and generate:

1. Overall Quality Score (0-100)
2. Bugs
3. Security Issues
4. Performance Problems
5. Code Smells
6. Best Practice Suggestions
7. Refactored Code
8. Detailed Explanation

Return response in strict JSON format only. Do not wrap it in Markdown fences.
Escape all newline characters inside string values. Use this exact schema:
{{
  "score": number,
  "bugs": string[],
  "securityIssues": string[],
  "performanceSuggestions": string[],
  "codeSmells": string[],
  "bestPractices": string[],
  "refactoredCode": string,
  "explanation": string
}}`],
  ['human', 'Language: {language}\n\nCode:\n```{language}\n{code}\n```']
]);

const extractJson = (text) => {
  try {
    return JSON.parse(text);
  } catch (err) {
    const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
    const candidate = fenced ? fenced[1] : text.match(/\{[\s\S]*\}/)?.[0];
    if (candidate) {
      try {
        return JSON.parse(candidate);
      } catch (innerErr) {
        return { raw: text };
      }
    }
    return { raw: text };
  }
};

const normalizeReview = (result) => {
  const score = Number(result.score ?? result['Overall Quality Score'] ?? result.qualityScore ?? 0);
  return {
    score: Number.isFinite(score) ? Math.min(100, Math.max(0, score)) : 0,
    bugs: Array.isArray(result.bugs) ? result.bugs : result.Bugs || [],
    securityIssues: Array.isArray(result.securityIssues) ? result.securityIssues : result['Security Issues'] || [],
    performanceSuggestions: Array.isArray(result.performanceSuggestions) ? result.performanceSuggestions : result['Performance Problems'] || [],
    codeSmells: Array.isArray(result.codeSmells) ? result.codeSmells : result['Code Smells'] || [],
    bestPractices: Array.isArray(result.bestPractices) ? result.bestPractices : result['Best Practice Suggestions'] || [],
    refactoredCode: result.refactoredCode || result['Refactored Code'] || '',
    explanation: result.explanation || result['Detailed Explanation'] || result.raw || ''
  };
};

const analyzeCode = async ({ code, language, userId, reviewId }) => {
  const promptValue = await reviewPrompt.formatMessages({ code, language });
  const promptText = promptValue.map((message) => `${message._getType()}: ${message.content}`).join('\n\n');
  const start = Date.now();

  try {
    const model = getGroqModel().bind({
      response_format: { type: 'json_object' }
    });
    const response = await model.invoke(promptValue, {
      runName: 'groq-code-review',
      tags: ['code-review', language],
      metadata: { userId: String(userId), reviewId: String(reviewId), language }
    });

    const text = typeof response.content === 'string'
      ? response.content
      : JSON.stringify(response.content);
    const normalized = normalizeReview(extractJson(text));
    const responseTimeMs = Date.now() - start;
    const usage = response.usage_metadata || {};
    const tokensEstimated = estimateTokens(promptText) + estimateTokens(text);

    try {
      await Trace.create({
        userId,
        reviewId,
        prompt: promptText,
        response: text,
        promptTokens: usage.input_tokens || 0,
        completionTokens: usage.output_tokens || 0,
        totalTokens: usage.total_tokens || 0,
        tokensEstimated,
        responseTimeMs,
        langSmithEnabled: process.env.LANGCHAIN_TRACING_V2 === 'true' || process.env.LANGSMITH_TRACING === 'true',
        model: process.env.GROQ_MODEL || DEFAULT_MODEL
      });
    } catch (err) {
      console.error('Failed to save trace', err);
    }

    return normalized;
  } catch (err) {
    console.error('AI analyze error', err);
    throw err;
  }
};

module.exports = { analyzeCode };

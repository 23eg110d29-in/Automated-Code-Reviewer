const { ChatGroq } = require('@langchain/groq');

const DEFAULT_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

const getGroqModel = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  return new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: DEFAULT_MODEL,
    temperature: 0.1,
    maxTokens: 4096
  });
};

module.exports = { getGroqModel, DEFAULT_MODEL };

const mongoose = require('mongoose');

const TraceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reviewId: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' },
  prompt: { type: String },
  response: { type: String },
  promptTokens: { type: Number, default: 0 },
  completionTokens: { type: Number, default: 0 },
  totalTokens: { type: Number, default: 0 },
  tokensEstimated: { type: Number, default: 0 },
  responseTimeMs: { type: Number, default: 0 },
  langSmithEnabled: { type: Boolean, default: false },
  model: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trace', TraceSchema);

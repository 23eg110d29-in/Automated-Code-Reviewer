const mongoose = require('mongoose');

const allowedLanguages = ['JavaScript', 'Python', 'Java', 'C', 'C++', 'TypeScript'];

const ReviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  language: { type: String, enum: allowedLanguages, required: true },
  code: { type: String, required: true },
  reviewResult: { type: mongoose.Schema.Types.Mixed, required: true },
  score: { type: Number, min: 0, max: 100, required: true },
  createdAt: { type: Date, default: Date.now }
});

ReviewSchema.index({ userId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1, language: 1 });

module.exports = mongoose.model('Review', ReviewSchema);

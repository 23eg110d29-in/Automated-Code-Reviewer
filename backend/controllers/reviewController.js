const Review = require('../models/Review');
const User = require('../models/User');
const { analyzeCode } = require('../services/aiReviewer');

const allowedLanguages = ['JavaScript', 'Python', 'Java', 'C', 'C++', 'TypeScript'];

exports.submitReview = async (req, res) => {
  try {
    const { code, language } = req.body;
    if (!code || !language) return res.status(400).json({ message: 'Code and language required' });
    if (!allowedLanguages.includes(language)) return res.status(400).json({ message: 'Unsupported language' });
    if (code.length > 50000) return res.status(413).json({ message: 'Code input is too large' });

    // Save placeholder review (so we can attach id to tracing)
    const temp = { userId: req.user._id, language, code, reviewResult: {}, score: 0 };
    const review = await Review.create(temp);
    const aiResult = await analyzeCode({ code, language, userId: req.user._id, reviewId: review._id });

    const updated = await Review.findByIdAndUpdate(review._id, {
      reviewResult: aiResult,
      score: Number(aiResult.score || 0)
    }, { new: true });

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const q = req.query.q?.trim();
    const filter = { userId: req.user._id };
    if (q) {
      filter.$or = [
        { language: { $regex: q, $options: 'i' } },
        { code: { $regex: q, $options: 'i' } },
        { 'reviewResult.explanation': { $regex: q, $options: 'i' } }
      ];
    }
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.userId.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Unauthorized' });
    await review.deleteOne();
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.adminStats = async (req, res) => {
  try {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Admin only' });
    const totalUsers = await User.countDocuments();
    const totalReviews = await Review.countDocuments();
    const mostReviewed = await Review.aggregate([
      { $group: { _id: '$language', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    const byLanguage = await Review.aggregate([
      { $group: { _id: '$language', count: { $sum: 1 }, averageScore: { $avg: '$score' } } },
      { $sort: { count: -1 } }
    ]);
    const reviewsLast7Days = await Review.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json({ totalUsers, totalReviews, mostReviewed: mostReviewed[0] || null, byLanguage, reviewsLast7Days });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

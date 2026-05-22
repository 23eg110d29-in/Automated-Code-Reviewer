const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');
const { submitReview, getReviews, deleteReview, adminStats } = require('../controllers/reviewController');

const validate = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
	next();
};

router.post('/submit', auth, [
	body('code').isString().trim().notEmpty(),
	body('language').isString().trim().notEmpty()
], validate, submitReview);

router.get('/', auth, getReviews);
router.get('/admin/stats', auth, adminStats);
router.delete('/:id', auth, deleteReview);

module.exports = router;

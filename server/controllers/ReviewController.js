const Review = require('../models/Review');

/**
 * CREATE REVIEW
 */
exports.createReview = async (req, res) => {
  try {
    const { name, comment, rating } = req.body;

    if (!name || !comment || !rating) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const review = await Review.create({
      name,
      comment,
      rating,
      user: req.user._id,
    });

    res.status(201).json({ message: 'Review added', data: review });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * GET ALL REVIEWS
 */
exports.getReviews = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      Review.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments(),
    ]);

    res.json({
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
};


/**
 * UPDATE REVIEW
 */
exports.updateReview = async (req, res) => {
  const { id } = req.params;
  const { name, comment, rating } = req.body;

  const review = await Review.findById(id);

  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  review.name = name;
  review.comment = comment;
  review.rating = rating;

  await review.save();

  res.json({ message: 'Review updated', data: review });
};

/**
 * DELETE REVIEW
 */
exports.deleteReview = async (req, res) => {
  const { id } = req.params;

  const review = await Review.findById(id);
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  await review.deleteOne();
  res.json({ message: 'Review deleted' });
};

const express = require('express');
const router = express.Router();
const reviewCtrl = require('../controllers/ReviewController');
const {protect} = require('../middleware/Auth');

router.post('/', protect, reviewCtrl.createReview);
router.get('/', reviewCtrl.getReviews);
router.put('/:id', protect, reviewCtrl.updateReview);
router.delete('/:id', protect, reviewCtrl.deleteReview);

module.exports = router;

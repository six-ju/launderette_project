const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

const ReviewsController = require('../controllers/reviews.controller');
const reviewsController = new ReviewsController();

router.get('/', authMiddleware, reviewsController.getReviews);
router.get('/owner/:userId', authMiddleware, reviewsController.getReviewByOwnerId);
router.get('/customer', authMiddleware, reviewsController.getReviewByCustomerId);
router.get('/customer/:serviceId', authMiddleware, reviewsController.getReviewByServiceId);
router.put('/customer/:serviceId', authMiddleware, reviewsController.updateReview);
router.post('/create', authMiddleware, reviewsController.createReview);

module.exports = router;

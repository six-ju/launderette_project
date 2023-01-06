const ReviewService = require('../services/reviews.service');

class ReviewsController {
  reviewService = new ReviewService();

  getReviews = async (req, res, next) => {
    try {
      const reviews = await this.reviewService.findAllReview();

      res.status(200).json({ data: reviews });
    } catch (err) {
      res.status(400).send({
        errorMessage: '리뷰 조회에 실패하였습니다.',
      });
      return;
    }
  };

  getReviewByOwnerId = async (req, res, next) => {
    let { userId } = req.params;
    if (userId === 'none') {
      userId = res.locals.user.userId;
    }
    const review = await this.reviewService.findReviewByOwnerId(userId);
    res.status(200).json({ data: review });
  };

  createReview = async (req, res, next) => {
    const { title, content, rate, serviceId } = req.body;
    const createReviewData = await this.reviewService.createReview(
      title,
      content,
      rate,
      serviceId
    );

    res.status(201).json({ data: createReviewData });
  };

  getReviewByServiceId = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const { serviceId } = req.params;
      const review = await this.reviewService.findReviewByServiceId(userId, serviceId);
      res.status(200).json({ data: review });
    } catch(err) {
      res.status(401).json({ errorMessage: "리뷰가 없습니다." });
    }
  };

  getReviewByCustomerId = async (req, res, next) => {
    try {
      const { userId } = res.locals.user;
      const review = await this.reviewService.findReviewByCustomerId(userId);
      res.status(200).json({ data: review });
    } catch(err) {
      res.status(401).json({ errorMessage: "리뷰가 없습니다." });
    }
  };

  updateReview = async (req, res, next) => {
    const { userId } = res.locals.user;
    const { serviceId } = req.params;
    const { title, content, rate } = req.body;

    const updateReview = await this.reviewService.updateReview(
      userId,
      title,
      content,
      rate,
      serviceId
    );

    res.status(200).json({ data: updateReview });
  };

  deleteReview = async (req, res, next) => {
    const { reviewId } = req.params;
    const { password } = req.body;

    const deleteReview = await this.reviewService.deleteReview(
      reviewId,
      password
    );

    res.status(200).json({ data: deleteReview });
  };
}

module.exports = ReviewsController;

const ReviewRepository = require('../repositories/reviews.repository');
const { Review } = require('../models');
const { Service } = require('../models');
const { User } = require('../models');

class ReviewService {
  reviewRepository = new ReviewRepository(Review, Service, User);

  findAllReview = async () => {
    const allReview = await this.reviewRepository.findAllReview();

    allReview.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return allReview.map((review) => {
      return {
        reviewId: review.reviewId,
        title: review.title,
        content: review.content,
        rate: review.rate,
        serviceId: review.serviceId,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      };
    });
  };

  findReviewByOwnerId = async (userId) => {
    const findReview = await this.reviewRepository.findReviewByOwnerId(userId);

    return findReview.map((review) => {
      return {
        reviewId: review.reviewId,
        title: review.title,
        content: review.content,
        rate: review.rate,
        serviceId: review.serviceId,
        customerNickname: review.nickname,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      };
    });
  };

  findReviewByServiceId = async (userId, serviceId) => {
    const findReview = await this.reviewRepository.findReviewByServiceId(
      userId,
      serviceId
    );

    return {
      reviewId: findReview.reviewId,
      title: findReview.title,
      content: findReview.content,
      rate: findReview.rate,
      serviceId: findReview.serviceId,
      createdAt: findReview.createdAt,
      updatedAt: findReview.updatedAt,
    };
  };

  findReviewByCustomerId = async (userId) => {
    const findReview = await this.reviewRepository.findReviewByCustomerId(
      userId
    );

    return findReview.map((review) => {
      return {
        reviewId: review.reviewId,
        title: review.title,
        content: review.content,
        rate: review.rate,
        serviceId: review.serviceId,
        customerId: review.customerId,
        nickname: review.nickname,
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
      };
    });
  };

  createReview = async (title, content, rate, serviceId) => {
    const createReviewData = await this.reviewRepository.createReview(
      title,
      content,
      rate,
      serviceId
    );

    return {
      reviewId: createReviewData.null,
      title: createReviewData.title,
      content: createReviewData.content,
      rate: createReviewData.rate,
      serviceId: createReviewData.serviceId,
      createdAt: createReviewData.createdAt,
      updatedAt: createReviewData.updatedAt,
    };
  };

  updateReview = async (userId, title, content, rate, serviceId) => {
    const findReview = await this.reviewRepository.findReviewByServiceId(
      userId,
      serviceId
    );

    await this.reviewRepository.updateReview(
      findReview.reviewId,
      title,
      content,
      rate
    );

    const updateReview = await this.reviewRepository.findReviewByServiceId(
      userId,
      serviceId
    );

    return {
      reviewId: updateReview.reviewId,
      title: updateReview.title,
      content: updateReview.content,
      rate: updateReview.rate,
      createdAt: updateReview.createdAt,
      updatedAt: updateReview.updatedAt,
    };
  };

  deleteReview = async (reviewId) => {
    const findReview = await this.reviewRepository.findReviewById(reviewId);
    if (!findReview) throw new Error("Review doesn't exist");

    await this.reviewRepository.deleteReview(reviewId);

    return {
      reviewId: findReview.reviewId,
      title: findReview.nickname,
      content: findReview.title,
      rate: findReview.content,
      createdAt: findReview.createdAt,
      updatedAt: findReview.updatedAt,
    };
  };
}

module.exports = ReviewService;

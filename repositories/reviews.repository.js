
class ReviewRepository {
  constructor(ReviewModel, ServiceModel, UserModel) {
    this.reviewModel = ReviewModel;
    this.serviceModel = ServiceModel;
    this.userModel = UserModel;
  }

  findAllReview = async () => {
    const reviews = await this.reviewModel.findAll();

    return reviews;
  };

  findReviewByOwnerId = async (ownerId) => {
    const review = await this.reviewModel.findAll({
      raw: true,
      attributes: {
        include: ['Service.customerId', 'Service.customer.nickname'],
      },
      include: [
        {
          model: this.serviceModel,
          attributes: [],
          where: { ownerId },
          include: [
            {
              model: this.userModel,
              as: 'customer',
              attributes: [],
            },
          ],
        },
      ],
    });
    return review;
  };

  findReviewByServiceId = async (customerId, serviceId) => {
    const review = await this.reviewModel.findOne({
      raw: true,
      include: [
        {
          model: this.serviceModel,
          attributes: [],
          where: { customerId },
          include: [
            {
              model: this.userModel,
              as: 'customer',
              attributes: [],
            },
          ],
        },
      ],
      where: { serviceId },
    });
    if (review===null) {
      review = {}
    }
    return review;
  };

  findReviewByCustomerId = async (customerId) => {
    const review = await this.reviewModel.findAll({
      raw: true,
      attributes: {
        include: ["Service.customerId", "Service.customer.nickname"],
      },
      include: [
        {
          model: this.serviceModel,
          attributes: [],
          where: { customerId },
          include: [
            {
              model: this.userModel,
              as: 'customer',
              attributes: [],
            },
          ],
        },
      ],
    });
    return review;
  };

  createReview = async (title, content, rate, serviceId) => {
    const createReviewData = await this.reviewModel.create({
      title,
      content,
      rate,
      serviceId,
    });

    return createReviewData;
  };

  updateReview = async (reviewId, title, content, rate) => {
    const updateReviewData = await this.reviewModel.update(
      { title, content, rate },
      { where: { reviewId } }
    );

    return updateReviewData;
  };

  deleteReview = async (reviewId) => {
    const deleteReviewData = await this.reviewModel.destroy({ where: { postId } });

    return deleteReviewData;
  };
}

module.exports = ReviewRepository;

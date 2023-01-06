'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Review.belongsTo(models.Service, { foreignKey: 'serviceId' });
    }
  }
  Review.init(
    {
      reviewId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      title: DataTypes.STRING,
      content: DataTypes.TEXT,
      rate: DataTypes.INTEGER,
      serviceId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Review',
    }
  );
  return Review;
};

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Service extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Service.belongsTo(models.User, {
        foreignKey: 'customerId',
        as: 'customer',
      });
      models.Service.belongsTo(models.User, {
        foreignKey: 'ownerId',
        as: 'owner',
      });
      models.Service.hasMany(models.Review, { foreignKey: 'serviceId' });
    }
  }
  Service.init(
    {
      serviceId: {
        primaryKey: true,
        type: DataTypes.INTEGER,
        autoIncrement: true,
      },
      status: DataTypes.STRING,
      image: DataTypes.STRING,
      customerRequest: DataTypes.STRING,
      customerId: DataTypes.INTEGER,
      ownerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Service',
    }
  );
  return Service;
};

'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Services', {
      serviceId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: '대기 중',
      },
      image: {
        type: Sequelize.STRING,
      },
      customerRequest: {
        type: Sequelize.STRING,
      },
      customerId: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      ownerId: {
        type: Sequelize.INTEGER,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.addConstraint('Services', {
      fields: ['customerId'],
      type: 'foreign key',
      name: 'FK_Services_Customers',
      references: {
        table: 'Users',
        field: 'userId',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
    await queryInterface.addConstraint('Services', {
      fields: ['ownerId'],
      type: 'foreign key',
      name: 'FK_Services_Owners',
      references: {
        table: 'Users',
        field: 'userId',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Services');
  },
};

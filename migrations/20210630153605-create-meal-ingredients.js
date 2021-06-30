'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('meal_ingredients', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      meal_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'meals',
          key: 'id',
        },
      },
      ingredient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ingredients',
          key: 'id',
        },
      },
      unit_type_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'unit_types',
          key: 'id',
        },
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('meal_ingredients');
  },
};

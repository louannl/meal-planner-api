import pkg from 'sequelize';
import Meal from './meal.model.js';
import Day from './day.model.js';

const { DataTypes } = pkg;

export default (sequelize) => {
  sequelize.define(
    'MealDay',
    {
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
      },
      meal_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        references: {
          model: Meal,
          key: 'id',
        },
      },
      day_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        references: {
          model: Day,
          key: 'id',
        },
      },
    },
    { tableName: 'meal_days' },
  );
};

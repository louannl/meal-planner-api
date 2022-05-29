import pkg from 'sequelize';
const { DataTypes } = pkg;
import Meal from './meal.model.js';
import Tag from './tag.model.js';

export default (sequelize) => {
  sequelize.define(
    'MealTag',
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
      tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        references: {
          model: Tag,
          key: 'id',
        },
      },
    },
    { tableName: 'meal_tags' }
  );
};

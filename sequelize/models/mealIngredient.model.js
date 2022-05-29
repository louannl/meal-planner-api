import pkg from 'sequelize';
const { DataTypes } = pkg;
import Meal from './meal.model.js';
import Ingredient from './ingredient.model.js';
import UnitType from './unitType.model.js';

export default (sequelize) => {
  sequelize.define(
    'MealIngredient',
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
      ingredient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        references: {
          model: Ingredient,
          key: 'id',
        },
      },
      unit_type_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
        references: {
          model: UnitType,
          key: 'id',
        },
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
    },
    { tableName: 'meal_ingredients' }
  );
};

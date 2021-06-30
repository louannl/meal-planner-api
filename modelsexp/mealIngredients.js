import ingredients from './ingredients';
import meals from './meals';
import unit_types from './unitTypes';

const MealIngredients = (sequelize, DataTypes) => {
  const mealIngredients = sequelize.define('meal_ingredients', {
    meal_id: {
      type: DataTypes.INTEGER,
      references: {
        model: meals,
        key: 'id',
      },
    },
    ingredient_id: {
      type: DataTypes.INTEGER,
      references: {
        model: ingredients,
        key: 'id',
      },
    },
    unit_type_id: {
      type: DataTypes.INTEGER,
      references: {
        model: unit_types,
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
  });

  return mealIngredients;
};

export default MealIngredients;

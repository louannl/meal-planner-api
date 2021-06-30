import MealIngredients from './mealIngredients';

const ingredients = (sequelize, DataTypes) => {
  const Ingredients = sequelize.define('ingredients', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Ingredients.associate = (models) => {
    Ingredients.belongsToMany(models.Meals, { through: MealIngredients });
  };

  return Ingredients;
};

export default ingredients;

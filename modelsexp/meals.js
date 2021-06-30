import MealDays from './mealDays';
import MealIngredients from './mealIngredients';
import MealTags from './mealTags';

const meals = (sequelize, DataTypes) => {
  const Meals = sequelize.define('meals', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  Meals.associate = (models) => {
    Meals.belongsToMany(models.Ingredients, { through: MealIngredients });
    Meals.belongsToMany(models.Days, { through: MealDays });
    Meals.belongsToMany(models.Tags, { through: MealTags });
  };

  return Meals;
};

export default meals;
//NOTE: Documentation on sequelize says that the default for many
//to many relationships is cascade on delete and update.

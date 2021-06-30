import MealIngredients from './mealIngredients';

const unit_types = (sequelize, DataTypes) => {
  const Unit_types = sequelize.define('unit_types', {
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    symbol: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 5],
      },
    },
  });

  Unit_types.associate = (models) => {
    Unit_types.belongsToMany(models.Meals, { through: MealIngredients });
    Unit_types.belongsToMany(models.Ingredients, { through: MealIngredients });
  };

  return Unit_types;
};

export default unit_types;

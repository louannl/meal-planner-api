const applyExtraSetup = (sequelize) => {
  const {
    Day,
    Ingredient,
    Meal,
    Tag,
    UnitType,
    MealDay,
    MealIngredient,
    MealTag,
  } = sequelize.models;

  Day.belongsToMany(Meal, { through: MealDay });
  Ingredient.belongsToMany(Meal, { through: MealIngredient });
  Meal.belongsToMany(Ingredient, { through: MealIngredient });
  Meal.belongsToMany(Tag, { through: MealTag });
  Meal.belongsToMany(Day, { through: MealDay });
  Tag.belongsToMany(Meal, { through: MealTag });
  UnitType.belongsToMany(Meal, { through: MealIngredient });
  UnitType.belongsToMany(Ingredient, { through: MealIngredient });
};

export default applyExtraSetup;

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

  Meal.belongsToMany(Day, { through: MealDay, foreignKey: 'meal_id' });
  Day.belongsToMany(Meal, { through: MealDay, foreignKey: 'day_id' });

  Meal.belongsToMany(Ingredient, {
    through: MealIngredient,
    foreignKey: 'meal_id',
  });
  Meal.belongsToMany(UnitType, {
    through: MealIngredient,
    foreignKey: 'meal_id',
  });

  Ingredient.belongsToMany(Meal, {
    through: MealIngredient,
    foreignKey: 'ingredient_id',
  });
  Ingredient.belongsToMany(UnitType, {
    through: MealIngredient,
    foreignKey: 'ingredient_id',
  });

  UnitType.belongsToMany(Meal, {
    through: MealIngredient,
    foreignKey: 'unit_type_id',
  });
  UnitType.belongsToMany(Ingredient, {
    through: MealIngredient,
    foreignKey: 'unit_type_id',
  });

  MealDay.belongsTo(Meal, { foreignKey: 'meal_id' });
  MealDay.belongsTo(Day, { foreignKey: 'day_id' });

  MealIngredient.belongsTo(Meal, { foreignKey: 'meal_id' });
  MealIngredient.belongsTo(Ingredient, { foreignKey: 'ingredient_id' });
  MealIngredient.belongsTo(UnitType, { foreignKey: 'unit_type_id' });

  Meal.belongsToMany(Tag, { through: MealTag, foreignKey: 'meal_id' });
  Tag.belongsToMany(Meal, { through: MealTag, foreignKey: 'tag_id' });

  Meal.addScope('mealInfo', {
    include: [
      {
        model: Ingredient,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        through: {
          attributes: [],
        },
        include: {
          model: UnitType,
          attributes: ['name', 'symbol'],
          through: {
            attributes: ['amount'],
          },
        },
      },
      {
        model: Day,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        through: {
          attributes: [],
        },
      },
      {
        model: Tag,
        attributes: ['name'],
        through: {
          attributes: [],
        },
      },
    ],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });

  Day.addScope('dayMeal', {
    order: [['id', 'ASC']],
    include: [
      {
        model: Meal,
        attributes: { exclude: ['createdAt', 'updatedAt'] },
        through: {
          attributes: [],
        },
        include: {
          model: Tag,
          attributes: ['name'],
          through: {
            attributes: [],
          },
        },
      },
    ],
    attributes: { exclude: ['createdAt', 'updatedAt'] },
  });
};

export default applyExtraSetup;

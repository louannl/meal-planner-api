const transformMealIngredients = (mealIngredients) => {
  const mappedIngredients = [];

  mealIngredients.forEach((ingredient) => {
    mappedIngredients.push({
      ingredient: ingredient.Ingredient.name,
      total: ingredient.dataValues.total,
      unit: ingredient.UnitType.name,
    });
  });

  return mappedIngredients;
};

export default transformMealIngredients;

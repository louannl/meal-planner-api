export const transformMealIngredients = (mealIngredients) => {
  let mappedIngredients = [];

  for (const ingredient of mealIngredients) {
    mappedIngredients.push({
      ingredient: ingredient.Ingredient['name'],
      total: ingredient.dataValues['total'],
      unit: ingredient.UnitType['name'],
    });
  }

  return mappedIngredients;
};

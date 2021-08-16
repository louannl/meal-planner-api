export const transformMealInfo = (mealInfo, id) => {
  let mealDays = [];
  let mealIngredients = [];
  let mealTags = [];

  for (const day of mealInfo.Days) {
    mealDays.push(day.id);
  }

  for (const ing of mealInfo.Ingredients) {
    mealIngredients.push({
      id,
      ingredient: ing.name,
      amount: ing['UnitTypes'][0]['MealIngredient'].amount,
      unit: ing['UnitTypes'][0].name,
    });
  }

  mealInfo.Tags.forEach((tag) => mealTags.push(tag.name));

  return {
    id: mealInfo.id,
    meal: mealInfo.name,
    days: mealDays,
    tags: mealTags,
    ingredients: mealIngredients,
  };
};

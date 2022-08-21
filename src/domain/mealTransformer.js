const transformMealInfo = (mealInfo) => ({
  id: mealInfo.id,
  meal: mealInfo.name,
  days: mealInfo.meal_days.map((day) => day.day_id),
  tags: mealInfo.meal_tags.map((tag) => tag.tags.name),
  ingredients: mealInfo.meal_ingredients.map((ing) => (
    {
      id: ing.ingredient_id,
      ingredient: ing.ingredients.name,
      amount: ing.amount,
      unit: ing.unit_types.name,
    }
  )),
});

export default transformMealInfo;

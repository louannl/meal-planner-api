export const transformTagMeals = (meals) => {
  const mealsWithTags = [];

  meals.forEach((meal) => {
    mealsWithTags.push({
      id: meal.meal_id,
      meal: meal.meals.name,
      tags: meal.meals.meal_tags.map((tag) => tag.tags.name),
    });
  });

  return mealsWithTags;
};

export const transformDayMeals = (dayInfo) => {
  const transformedDays = [];

  dayInfo.forEach((day) => {
    const meals = transformTagMeals(day.meal_days);
    transformedDays.push({
      id: day.id,
      name: day.name,
      meals,
    });
  });

  return transformedDays;
};

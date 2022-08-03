export const transformTagMeals = (meals) => {
  const tagMeals = [];

  meals.forEach((meal) => {
    tagMeals.push({
      id: meal.id,
      meal: meal.name,
      tags: meal.Tags.map((tag) => tag.name),
    });
  });

  return tagMeals;
};

export const transformDayMeals = (dayInfo) => {
  const transformedDays = [];

  dayInfo.forEach((day) => {
    const meals = [];
    day.meal_days.forEach((meal) => {
      meals.push({
        id: meal.meal_id,
        meal: meal.meals.name,
        tags: meal.meals.meal_tags.map((tag) => tag.tags.name),
      });
    });
    transformedDays.push({
      id: day.id,
      name: day.name,
      meals,
    });
  });

  return transformedDays;
};

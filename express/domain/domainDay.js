export const transformDayMeals = (dayInfo) => {
  let mappedDays = [];

  dayInfo.forEach((day) => {
    let dayMeals = [];

    for (const meal of day.Meals) {
      dayMeals.push({
        id: meal.id,
        meal: meal.name,
        tags: meal.Tags.map((tag) => tag.name),
      });
    }

    mappedDays.push({
      id: day.id,
      name: day.name,
      meals: dayMeals,
    });
  });

  return mappedDays;
};

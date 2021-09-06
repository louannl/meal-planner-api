export const transformTagMeals = (meals) => {
  let tagMeals = [];

  for (const meal of meals) {
    tagMeals.push({
      id: meal.id,
      meal: meal.name,
      tags: meal.Tags.map((tag) => tag.name),
    });
  }

  return tagMeals;
};

export const transformDayMeals = (dayInfo) => {
  let mappedDays = [];

  dayInfo.forEach((day) => {
    const dayMeals = transformTagMeals(day.Meals);

    mappedDays.push({
      id: day.id,
      name: day.name,
      meals: dayMeals,
    });
  });

  return mappedDays;
};

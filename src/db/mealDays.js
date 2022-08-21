import prisma from '../../prisma.js';

export const createMealDays = async (transaction, mealId, dayIds) => {
  await transaction.meal_days.createMany({
    data: dayIds.map((id) => ({ meal_id: mealId, day_id: Number(id) })),
  });
};

export const getMealsWithDays = () => prisma.days.findMany({
  select: {
    id: true,
    name: true,
    meal_days: {
      select: {
        meal_id: true,
        meals: {
          select: {
            name: true,
            meal_tags: { select: { tags: { select: { name: true } } } },
          },
        },
      },
    },
  },
});

export const getMealsByDay = (dayId) => prisma.days.findUnique({
  where: { id: dayId },
  select: {
    meal_days: {
      select: {
        meal_id: true,
        meals: {
          select: {
            name: true,
            meal_tags: { select: { tags: { select: { name: true } } } },
          },
        },
      },
    },
  },
});

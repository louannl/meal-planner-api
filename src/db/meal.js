import prisma from '../../prisma.js';
import createMealTags from './mealTags.js';
import { createMealIngredients } from './mealIngredients.js';
import { createMealDays } from './mealDays.js';

export const getMealById = (id) => prisma.meals.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    meal_days: {
      select: { day_id: true },
    },
    meal_tags: {
      select: { tags: { select: { name: true } } },
    },
    meal_ingredients: {
      select: {
        ingredient_id: true,
        ingredients: { select: { name: true } },
        amount: true,
        unit_types: { select: { name: true } },
      },
    },
  },
});

export const createMeal = (body) => {
  const {
    dayIds, mealName, mealTags, ingredients,
  } = body;

  // eslint-disable-next-line no-shadow
  return prisma.$transaction(async (prisma) => {
    const meal = await prisma.meals.create({
      data: {
        name: mealName,
      },
    });

    await Promise.all([
      createMealDays(prisma, meal.id, dayIds),
      createMealTags(prisma, meal.id, mealTags),
      createMealIngredients(prisma, meal.id, ingredients),
    ]);
  });
};

export const updateMeal = (body, mealId) => {
  const {
    dayIds, mealName, mealTags, ingredients,
  } = body;

  // eslint-disable-next-line no-shadow
  return prisma.$transaction(async (prisma) => {
    await prisma.meals.update({
      where: { id: mealId },
      data: {
        name: mealName,
        meal_days: {
          deleteMany: {},
        },
        meal_tags: {
          deleteMany: {},
        },
        meal_ingredients: {
          deleteMany: {},
        },
      },
    });
    await Promise.all([
      createMealDays(prisma, mealId, dayIds),
      createMealTags(prisma, mealId, mealTags),
      createMealIngredients(prisma, mealId, ingredients),
    ]);
  });
};

export const deleteMeal = async (id) => {
  await prisma.meals.update({
    where: { id },
    data: {
      meal_days: {
        deleteMany: {},
      },
      meal_tags: {
        deleteMany: {},
      },
      meal_ingredients: {
        deleteMany: {},
      },
    },
  });
  await prisma.meals.delete({
    where: { id },
  });
};

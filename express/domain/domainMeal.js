import prisma from '../../prisma.js';

export const transformMealInfo = (mealInfo) => ({
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

const createMealTags = async (prismaTransaction, mealId, tags) => {
  const mealTags = [];
  tags.forEach((tag) => {
    mealTags.push((prismaTransaction.meal_tags.create({
      data: {
        meals: {
          connect: { id: mealId },
        },
        tags: {
          connectOrCreate: {
            create: { name: tag },
            where: { name: tag },
          },
        },
      },
    })));
  });
  await Promise.all(mealTags);
};

const createMealIngredients = async (prismaTransaction, mealId, ingredients) => {
  const mealIngredients = [];
  ingredients.forEach((ingredient) => {
    mealIngredients.push((prismaTransaction.meal_ingredients.create({
      data: {
        meals: {
          connect: { id: mealId },
        },
        unit_types: {
          connect: { id: Number(ingredient.unitType) },
        },
        amount: Number(ingredient.amount),
        ingredients: {
          connectOrCreate: {
            create: { name: ingredient.name },
            where: { name: ingredient.name },
          },
        },
      },
    })));
  });
  await Promise.all(mealIngredients);
};

const createMealDays = async (prismaTransaction, mealId, dayIds) => {
  await prismaTransaction.meal_days.createMany({
    data: dayIds.map((id) => ({ meal_id: mealId, day_id: Number(id) })),
  });
};

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

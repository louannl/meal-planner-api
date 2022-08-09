import sequelize, {
  Ingredient,
  Meal,
  MealDay,
  MealIngredient,
  MealTag,
  Tag,
} from '../../sequelize/index.js';
import { updateName } from './domainHelper.js';
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

const deleteByMealId = (table, id, transaction) => sequelize.models[table].destroy(
  {
    where: {
      meal_id: id,
    },
  },
  { transaction },
);

export const createMeal = (body) => {
  const {
    dayIds, mealName, mealTags, ingredients,
  } = body;

  // eslint-disable-next-line no-shadow
  return prisma.$transaction(async (prisma) => {
    // Create meal
    const meal = await prisma.meals.create({
      data: {
        name: mealName,
      },
    });

    //  create meal days using ids
    await prisma.meal_days.createMany({
      data: dayIds.map((id) => ({ meal_id: meal.id, day_id: Number(id) })),
    });

    //  if tags, find or create using tag name
    //  create tags if they don't exist, then create relation
    const createMealTags = [];
    mealTags.forEach((tag) => {
      createMealTags.push((prisma.meal_tags.create({
        data: {
          meals: {
            connect: { id: meal.id },
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
    await Promise.all(createMealTags);

    const createMealIngredients = [];
    ingredients.forEach((ingredient) => {
      createMealIngredients.push((prisma.meal_ingredients.create({
        data: {
          meals: {
            connect: { id: meal.id },
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
    await Promise.all(createMealIngredients);
  });
};

export const updateMeal = (body, mealId) => {
  const {
    dayIds, mealName, mealTags, ingredients,
  } = body;

  return sequelize.transaction(async (transaction) => {
    // UPDATE MEAL NAME
    updateName('Meal', mealName, mealId, transaction);
    // UPDATE MEAL DAYS
    deleteByMealId('MealDay', mealId, transaction);

    const mappedDays = [];
    dayIds.forEach((dayId) => {
      mappedDays.push({
        meal_id: mealId,
        day_id: dayId,
      });
    });

    await MealDay.bulkCreate(mappedDays, { transaction });

    // UPDATE INGREDIENTS
    deleteByMealId('MealIngredient', mealId, transaction);

    for (const ingredient of ingredients) {
      const ingredientResult = await Ingredient.findOrCreate({
        where: { name: ingredient.name },
        transaction,
      });
      await MealIngredient.create(
        {
          ingredient_id: ingredientResult[0].dataValues.id,
          meal_id: mealId,
          amount: ingredient.amount,
          unit_type_id: ingredient.unitType,
        },
        { transaction },
      );
    }

    // UPDATE TAGS
    deleteByMealId('MealTag', mealId, transaction);

    if (mealTags.length > 0) {
      for (const tag of mealTags) {
        const tagResult = await Tag.findOrCreate({
          where: { name: tag },
          transaction,
        });
        await MealTag.create(
          {
            meal_id: mealId,
            tag_id: tagResult[0].dataValues.id,
          },
          { transaction },
        );
      }
    }
  });
};

export const deleteMeal = (id) => sequelize.transaction(async (transaction) => {
  await Promise.all([
    deleteByMealId('MealDay', id, transaction),
    deleteByMealId('MealIngredient', id, transaction),
    deleteByMealId('MealTag', id, transaction),
  ]);

  await Meal.destroy(
    {
      where: {
        id,
      },
    },
    { transaction },
  );
});

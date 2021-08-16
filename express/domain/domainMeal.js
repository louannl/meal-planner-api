import sequelize, {
  Ingredient,
  MealDay,
  MealIngredient,
  MealTag,
  Tag,
} from '../../sequelize/index.js';
import { createName } from './domainHelper.js';

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

export const createMeal = (body) => {
  const { dayIds, mealName, mealTags, ingredients } = body;
  return sequelize.transaction(async (transaction) => {
    const {
      dataValues: { id: meal_id },
    } = await createName('Meal', mealName, transaction);

    for (const dayId of dayIds) {
      await MealDay.create(
        {
          meal_id,
          day_id: dayId,
        },
        { transaction }
      );
    }

    for (const ingredient of ingredients) {
      const ingredientResult = await Ingredient.findOrCreate({
        where: { name: ingredient.name },
        transaction,
      });

      const ingredient_id = ingredientResult[0].dataValues.id;

      await MealIngredient.create(
        {
          ingredient_id,
          meal_id,
          amount: ingredient.amount,
          unit_type_id: ingredient.unitType,
        },
        { transaction }
      );
    }

    if (mealTags.length > 0) {
      for (const tag of mealTags) {
        const tagResult = await Tag.findOrCreate({
          where: { name: tag },
          transaction,
        });

        const tag_id = tagResult[0].dataValues.id;

        await MealTag.create(
          {
            meal_id,
            tag_id,
          },
          { transaction }
        );
      }
    }
  });
};

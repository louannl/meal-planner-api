import {
  deleteAll,
  deleteBy,
  insert,
  insertAndReturnId,
  selectBy,
  update,
} from '../db/dbHandlers.js';
import { processMealTags, updateMealTags } from './tags.js';
import { createMealIngredients, updateMealIngredients } from './ingredients.js';
import * as dbMeals from '../db/dbMeals.js';
import { returnMealIngredients } from '../db/dbIngredients.js';
import AppError from '../utils/appError.js';
import { insertMealDays, updateMealDays } from './days.js';

export const getMealswithDay = async () => {
  const { rows } = await dbMeals.returnMealsByDay();
  //TODO: Probably a cleaner way of doing this?
  let data = [];
  for (const row of rows) {
    if (!data.some((e) => e.meal_id === row.meal_id)) {
      data.push({
        meal_id: row.meal_id,
        meal: row.meal,
        day: row.day,
        tags: [row.tags],
      });
      continue;
    }
    let index = data.findIndex((e) => e.meal_id === row.meal_id);
    data[index].tags.push(row.tags);
  }
  return data;
};

export const getMealsByDay = async (dayId) => {
  const { rows } = await dbMeals.returnMealByDayId(dayId);
  //TODO: Can be cleared up to remove repetitive code
  let data = [];
  for (const row of rows) {
    if (!data.some((e) => e.meal_id === row.meal_id)) {
      data.push({
        meal_id: row.meal_id,
        meal: row.meal,
        tags: [row.tags],
      });
      continue;
    }
    let index = data.findIndex((e) => e.meal_id === row.meal_id);
    data[index].tags.push(row.tags);
  }

  if (!Array.isArray(data) || !data.length) {
    return;
  }

  return data;
};

//TODO: GET meal info
export const getMealInfo = async (mealId) => {
  //TODO: if no meal by that id?
  let meal = await selectBy('meals', 'name', 'id', mealId);
  if (!meal.length) {
    throw new AppError('No data found', 404);
  }
  let { rows: days } = await dbMeals.returnMealDays(mealId);
  days = days.map((value) => {
    return value.day;
  });
  let { rows: tags } = await dbMeals.returnMealTags(mealId);
  tags = tags.map((value) => {
    return value.tag;
  });
  const { rows: ingredients } = await returnMealIngredients(mealId);

  let data = { meal: meal[0].name, days, tags, ingredients };
  return data;
};

export const createMeal = async (dayIds, mealName, mealTags, ingredients) => {
  const { id: mealId } = await insertAndReturnId('meals', [{ name: mealName }]);
  await insertMealDays(mealId, dayIds);
  if (mealTags) {
    await processMealTags(mealId, mealTags);
  }
  await createMealIngredients(mealId, ingredients);
};

export const updateMeal = async (
  mealId,
  mealName,
  dayIds,
  mealTags,
  ingredients
) => {
  //As not using an ORM, this becomes to tedious to update individual parts
  //so most cases the functions will delete all existing and then re-create
  await update('meals', mealId, [{ name: mealName }]);
  await updateMealDays(mealId, dayIds);
  await updateMealTags(mealId, mealTags);
  await updateMealIngredients(mealId, ingredients);
};

export const deleteMeal = async (mealId) => {
  await Promise.all([
    deleteBy('meal_days', mealId, 'meal_id'),
    deleteBy('meal_tags', mealId, 'meal_id'),
    deleteBy('meal_ingredients', mealId, 'meal_id'),
  ]);

  await deleteBy('meals', mealId);
};

export const deleteAllMeals = async () => {
  await Promise.all([
    deleteAll('meal_days'),
    deleteAll('meal_tags'),
    deleteAll('meal_ingredients'),
  ]);

  await deleteAll('meals');
};

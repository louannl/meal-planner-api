import {
  deleteAll,
  deleteBy,
  insertAndReturnId,
  selectAll,
  selectBy,
  update,
} from '../db/dbHandlers.js';
import { processMealTags, updateMealTags } from './tags.js';
import { createMealIngredients, updateMealIngredients } from './ingredients.js';
import * as dbMeals from '../db/dbMeals.js';
import { returnMealIngredients } from '../db/dbIngredients.js';
import AppError from '../utils/appError.js';
import { insertMealDays, updateMealDays } from './days.js';

const flattenMeals = (meals) => {
  let flatMeals = [];
  for (const meal of meals) {
    if (!flatMeals.some((flatMeal) => flatMeal.id === meal.id)) {
      flatMeals.push({
        ...meal,
        tags: meal.tags ? [meal.tags] : [],
      });
      continue;
    }
    flatMeals[
      flatMeals.findIndex((flatMeal) => flatMeal.id === meal.id)
    ].tags.push(meal.tags);
  }
  return flatMeals;
};

export const getMealsWithDay = async () => {
  let { rows: days } = await selectAll('days');

  for (let day of days) {
    day.meals = flattenMeals((await dbMeals.returnMealByDayId(day.id)).rows);
  }

  return days;
};

export const getMealsByDay = async (dayId) => {
  const { rows } = await dbMeals.returnMealByDayId(dayId);
  //FIXME: Can be cleared up to remove repetitive code
  let data = [];
  for (const row of rows) {
    if (!data.some((e) => e.id === row.id)) {
      data.push({
        id: row.id,
        meal: row.meal,
        tags: [row.tags],
      });
      continue;
    }
    let index = data.findIndex((e) => e.id === row.id);
    data[index].tags.push(row.tags);
  }

  if (!Array.isArray(data) || !data.length) {
    return;
  }

  return data;
};

export const getMealInfo = async (mealId) => {
  //FIXME: if no meal by that id?
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
  //FIXME: Fix if mealTags array is empty
  const { id: mealId } = await insertAndReturnId('meals', [{ name: mealName }]);
  await insertMealDays(mealId, dayIds);
  if (mealTags && mealTags.length) {
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

export const deleteDayFromMeal = async (mealId, dayId) => {
  //TODO: Check this works properly
  const days = await selectBy('meal_days', 'day_id', 'meal_id', mealId);
  if (Object.keys(days).length > 1) {
    await dbMeals.deleteDayByMealId(mealId, dayId);
  } else {
    await deleteMeal(mealId);
  }
};

export const deleteAllMeals = async () => {
  await Promise.all([
    deleteAll('meal_days'),
    deleteAll('meal_tags'),
    deleteAll('meal_ingredients'),
  ]);

  await deleteAll('meals');
};

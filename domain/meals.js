import {
  deleteAll,
  deleteBy,
  insert,
  insertAndReturnId,
  update,
} from '../db/dbHandlers.js';
import { processMealTags, updateMealTags } from './tags.js';
import { createMealIngredients, updateMealIngredients } from './ingredients.js';
import { returnMealByDayId, returnMealsByDay } from '../db/dbMeals.js';

export const getMealswithDay = async () => {
  const { rows } = await returnMealsByDay();
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

//TODO: GET ALL MEALS by day
export const getMealsByDay = async (dayId) => {
  const { rows } = await returnMealByDayId(dayId);
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

//TODO: GET ALL meal info

export const createMeal = async (dayId, mealName, mealTags, ingredients) => {
  const { id: mealId } = await insertAndReturnId('meals', [{ name: mealName }]);
  await insert('meal_days', [{ meal_id: mealId, day_id: dayId }]);
  if (mealTags) {
    await processMealTags(mealId, mealTags);
  }
  await createMealIngredients(mealId, ingredients);
};

export const updateMeal = async (
  mealId,
  mealName,
  dayId,
  mealTags,
  ingredients
) => {
  //As not using an ORM, this becomes to tedious to update individual parts
  //so most cases the functions will delete all existing and then re-create
  await update('meals', mealId, [{ name: mealName }]);
  await update('meal_days', mealId, [{ day_id: dayId }], 'meal_id');
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

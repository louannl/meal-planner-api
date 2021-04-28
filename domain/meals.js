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

//TODO: GET ALL MEALINGREDIENTS
//TODO: GET ALL MEALS by day

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

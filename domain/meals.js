import {
  deleteAll,
  deleteOne,
  insert,
  insertAndReturnId,
} from '../db/dbHandlers.js';
import { processMealTags } from './tags.js';
import { createMealIngredients } from './ingredients.js';

//TODO: GET ALL INGREDIENTS
//TODO: GET ALL MEALS by day

export const createMeal = async (dayId, mealName, mealTags, ingredients) => {
  //MEALNAME
  const { id: mealId } = await insertAndReturnId('meals', [{ name: mealName }]);
  //TODO: replace createMealDay with insert maybe
  await insert('meal_days', [{ meal_id: mealId, day_id: dayId }]);
  //TAGS
  if (mealTags) {
    await processMealTags(mealId, mealTags);
  }
  //TODO: INGREDIENTS
  await createMealIngredients(mealId, ingredients);
};

//TODO: PUT MEAL/:id (update)

export const deleteMeal = async (mealId) => {
  await Promise.all([
    deleteOne('meal_days', mealId, 'meal_id'),
    deleteOne('meal_tags', mealId, 'meal_id'),
    deleteOne('meal_ingredients', mealId, 'meal_id'),
  ]);

  await deleteOne('meals', mealId);
};
export const deleteAllMeals = async () => {
  await Promise.all([
    deleteAll('meal_days'),
    deleteAll('meal_tags'),
    deleteAll('meal_ingredients'),
  ]);

  await deleteAll('meals');
};

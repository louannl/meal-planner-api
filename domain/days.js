import { deleteBy, insert } from '../db/dbHandlers.js';

export const insertMealDays = async (mealId, dayIds) => {
  const mealDays = dayIds.map((id) => {
    return { meal_id: mealId, day_id: id };
  });

  await insert('meal_days', mealDays);
};

//TODO: Similar code used in mealtags
export const updateMealDays = async (mealId, dayIds) => {
  await deleteBy('meal_days', mealId, 'meal_id');
  await insertMealDays(mealId, dayIds);
};

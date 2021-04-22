import { insert, insertAndReturnId } from '../db/dbHandlers.js';
import { processMealTags } from './tags.js';
import { createMealIngredients } from './ingredients.js';

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

//TODO: GET MEALS (WITH COMMENTS) BY DAY
//TODO: PUT MEAL/:id
//TODO: DELETE MEAL/:id
//TODO: GET ALL INGREDIENTS
//TODO: GET ALL MEALS by day

import { createMissingItems } from './domainHandler.js';
import { insert } from '../db/dbHandlers.js';

export const createMealIngredients = async (mealId, ingredients) => {
  const ingredientNames = ingredients.map((ingredient) => ingredient.name);
  createMissingItems(
    'ingredients',
    ingredientNames.map((ingredient) => {
      return { name: ingredient };
    })
  );
  //TODO: create meal_ingredients for all ingredients
  //ADD INGREDIENTS ---
  //getIngredient_Id
  //append mealId
  //INPUT INGREDIENT AMOUNT
  //INPUT INGREDIENT UNITTYPE
};

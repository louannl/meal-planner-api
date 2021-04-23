import { createMissingItems } from './domainHandler.js';
import { insert, selectBy } from '../db/dbHandlers.js';

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
  const ingredientIdNames = await selectBy(
    'ingredients',
    'id, name',
    'name',
    ingredientNames
  );
  //append mealId
  const mergedIngredientData = mergeNestedObjectsByName(
    ingredientIdNames,
    ingredients
  );

  //this should give me name, id,amount, unitType
  let mealIngredientData = mergedIngredientData.map((ingredient) => {
    return {
      meal_id: ingredient.meal_id,
      ingredient_id: ingredient.ingredient_id,
      amount: ingredient.amount,
      unit_type_id: ingredient.unitType,
    };
  });

  await insert('meal_ingredients', mealIngredientData);
};

const mergeNestedObjectsByName = (array1, array2) => {
  return array1.map((item) => {
    return {
      ...item,
      ...array2.find((item2) => item.name === item2.name)[0],
    };
  });
};

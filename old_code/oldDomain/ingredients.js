import { createMissingItems } from './domainHandler.js';
import { deleteBy, insert, selectBy } from '../db/dbHandlers.js';
import AppError from '../utils/appError.js';

const mergeNestedObjectsByName = (array1, array2) => {
  return array1.map((item) => {
    return {
      ...item,
      ...array2.find((item2) => item.name === item2.name),
    };
  });
};

export const createMealIngredients = async (mealId, ingredients) => {
  const ingredientNames = ingredients.map((ingredient) => ingredient.name);
  await createMissingItems(
    'ingredients',
    ingredientNames.map((ingredient) => {
      return { name: ingredient };
    })
  );

  const ingredientIdNames = await selectBy(
    'ingredients',
    'name, id',
    'name',
    ingredientNames
  );

  const mergedIngredientData = mergeNestedObjectsByName(
    ingredientIdNames,
    ingredients
  );

  let mealIngredientData = mergedIngredientData.map((ingredient) => {
    return {
      meal_id: mealId,
      ingredient_id: ingredient.id,
      amount: ingredient.amount,
      unit_type_id: ingredient.unitType,
    };
  });

  await insert('meal_ingredients', mealIngredientData);
};

export const updateMealIngredients = async (mealId, ingredients) => {
  await deleteBy('meal_ingredients', mealId, 'meal_id');
  await createMealIngredients(mealId, ingredients);
};

export const deleteIngredient = async (ingredient) => {
  const ingredientIdArray = await selectBy(
    'ingredients',
    'id',
    'name',
    ingredient
  );
  const ingredientId = ingredientIdArray[0].id;

  const mealsWithIngredient = await selectBy(
    'meal_ingredients',
    'meal_id',
    'ingredient_id',
    ingredientId
  );

  if (!Array.isArray(mealsWithIngredient) || !mealsWithIngredient.length) {
    await deleteBy('meal_ingredients', ingredientId, 'ingredient_id');
    await deleteBy('ingredients', ingredientId);
    return;
  }

  throw new AppError(
    'Ingredient is in use, please remove from meal/s first.',
    404
  );
};

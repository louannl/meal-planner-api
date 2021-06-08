import { createMissingItems } from './domainHandler.js';
import { deleteBy, insert, selectBy } from '../db/dbHandlers.js';

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
  //TODO: Similar code to the delete tag, remove duplicate code
  const ingredientId = await selectBy('ingredients', 'id', 'name', ingredient);
  //FIXME: If deletes last meal ingredient it needs to also delete the meal OR fail
  await deleteBy('meal_ingredients', ingredientId[0].id, 'ingredient_id');
  await deleteBy('ingredients', ingredientId[0].id);
};

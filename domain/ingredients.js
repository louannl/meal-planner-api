const { insert, getExistingItems } = require('../db/dbHandlers');

exports.createMealIngredients = async (mealId, ingredients) => {
  //TODO: Replace this code with create missingItems code in meals.js
  const ingredientNames = ingredients.map((ingredient) => ingredient.name);
  const IngredientExists = await getExistingItems(
    'ingredients',
    ingredientNames
  );
  const existingIngredients = IngredientExists.map(
    (ingredient) => ingredient.name
  );
  const missingIngredients = ingredients.filter(
    (ingredient) => !existingIngredients.includes(ingredient.name)
  );

  insert(
    'ingredients',
    missingIngredients.map((ingredient) => {
      return { name: ingredient.name };
    })
  );

  //TODO: create meal_ingredients for all ingredients
  //ADD INGREDIENTS ---
  //INPUT INGREDIENT AMOUNT
  //INPUT INGREDIENT UNITTYPE
};

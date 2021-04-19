const dbMeals = require('../db/dbMeals');
const dbIngredients = require('../db/dbIngredients');

exports.createMealIngredients = async (mealId, ingredients) => {
  const ingredientNames = ingredients.map((ingredient) => ingredient.name);
  const IngredientExists = await dbMeals.existingNames(
    'ingredients',
    ingredientNames
  );
  const existingIngredients = IngredientExists.map(
    (ingredient) => ingredient.name
  );
  const missingIngredients = ingredients.filter(
    (ingredient) => !existingIngredients.includes(ingredient.name)
  );
  missingIngredients.forEach((ingredient) => {
    dbIngredients.insertIngredient(ingredient.name, ingredient.unitType);
  });
  //create meal_ingredients for all ingredients
  //ADD INGREDIENTS ---
  //INPUT INGREDIENT NAME
  //INPUT INGREDIENT AMOUNT
  //INPUT INGREDIENT UNITTYPE
  //ADD MULTIPLE
};

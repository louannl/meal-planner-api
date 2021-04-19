const dbMeals = require('../db/dbMeals');
const dbIngredients = require('../db/dbIngredients');
const dbHandler = require('../db/dbHandlers');
const { createTags } = require('./tags');

exports.createMeal = async (dayId, mealName, mealTags, ingredients) => {
  //MEAL
  //create meal and return id
  const { id: mealId } = await dbHandler.insertAndReturnId('meals', mealName);
  //DAY
  await dbMeals.createMealDay(mealId, dayId);
  //TAGS
  createTags(mealId, mealTags);

  //INGREDIENTS
  //map to get ingreient names only
  const ingredientNames = ingredients.map((ingredient) => ingredient.name);
  //check these ingredientNames to db to show only existing ingredients
  const IngredientExists = await dbMeals.existingNames(
    'ingredients',
    ingredientNames
  );
  //filter original ingredients to show only missing ingredients & unit
  const existingIngredients = IngredientExists.map(
    (ingredient) => ingredient.name
  );
  const missingIngredients = ingredients.filter(
    (ingredient) => !existingIngredients.includes(ingredient.name)
  );
  //for each missing ingredient, add to database
  missingIngredients.forEach((ingredient) => {
    dbIngredients.insertIngredient(ingredient.name, ingredient.unitType);
  });
  //create meal ingredients for all ingredients
};

//INPUT SELECT DAY
//INPUT MEAL NAME
//INPUT MEAL TAG (OPTIONAL)
//ADD INGREDIENTS ---
//INPUT INGREDIENT NAME
//INPUT INGREDIENT AMOUNT
//INPUT INGREDIENT UNITTYPE
//ADD MULTIPLE
//ADD COMMENT

//GET MEALS (WITH COMMENTS) BY DAY

//GET UNITS
//POST MEAL
// add day_meals record
// add ingredients to DB, check if ingredient already exists
// add ingredients to meal via meal_ingredients

//PUT MEAL/:id
//DELETE MEAL/:id
//GET ALL INGREDIENTS
//GET ALL MEALS

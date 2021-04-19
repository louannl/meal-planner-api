const dbMeals = require('../db/dbMeals');
const dbIngredients = require('../db/dbIngredients');

exports.createMeal = async (dayId, mealName, mealTag, ingredients) => {
  //INGREDIENTS
  //map to get ingreient names only
  const names = ingredients.map((ingredient) => ingredient.name);
  //check these names to db to show only existing ingredients
  const rows = await dbMeals.existingIngredients(names);
  //filter original ingredients to show only missing ingredients & unit
  const existingIngredients = rows.map((ingredient) => ingredient.name);
  const missingIngredients = ingredients.filter(
    (ingredient) => !existingIngredients.includes(ingredient.name)
  );
  //for each missing ingredient, add to database
  missingIngredients.forEach((ingredient) => {
    dbIngredients.insertIngredient(ingredient.name, ingredient.unitType);
  });
  //create meal ingredients for all ingredients
  /*
  db.query(
    'INSERT INTO meal_ingredients (mealId, ingredientId, amount, unitType) VALUES ($1, $2, $3, $4)',
    [mealId, ingredientId, amount, unitType]
  );
  */
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

const dbMeals = require('../db/dbMeals');
const dbIngredients = require('../db/dbIngredients');
const dbHandler = require('../db/dbHandlers');
const { createMealTags } = require('./tags');
const { createMealIngredients } = require('./ingredients');

exports.createMeal = async (dayId, mealName, mealTags, ingredients) => {
  //MEALNAME
  const { id: mealId } = await dbHandler.insertAndReturnId('meals', mealName);
  //DAY
  await dbMeals.createMealDay(mealId, dayId);
  //TAGS
  createMealTags(mealId, mealTags);
  //INGREDIENTS
  createMealIngredients(mealId, ingredients);
};

//ADD COMMENT

//GET MEALS (WITH COMMENTS) BY DAY

//PUT MEAL/:id
//DELETE MEAL/:id
//GET ALL INGREDIENTS
//GET ALL MEALS by day

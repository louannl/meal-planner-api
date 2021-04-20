const {
  insertAndReturnId,
  insert,
  getExistingItems,
} = require('../db/dbHandlers');
const { createMealDay } = require('../db/dbMeals');
const { processMealTags } = require('./tags');
const { createMealIngredients } = require('./ingredients');

exports.createMeal = async (dayId, mealName, mealTags, ingredients) => {
  //MEALNAME
  const { id: mealId } = await insertAndReturnId('meals', [{ name: mealName }]);
  //DAY
  await createMealDay(mealId, dayId);
  //TAGS
  if (mealTags) {
    createMissingItems(
      'tags',
      mealTags.map((tag) => {
        return { name: tag };
      })
    );
    await processMealTags(mealId, mealTags);
  }
  //TODO: INGREDIENTS
  await createMealIngredients(mealId, ingredients);
};

const createMissingItems = async (table, values) => {
  const names = values.map((value) => value.name);
  const existingItems = await getExistingItems(table, names);
  const missingItems = values.filter(
    (value) => !existingItems.includes(value.name)
  );
  await insert(table, missingItems);
};

//TODO: GET MEALS (WITH COMMENTS) BY DAY
//TODO: PUT MEAL/:id
//TODO: DELETE MEAL/:id
//TODO: GET ALL INGREDIENTS
//TODO: GET ALL MEALS by day

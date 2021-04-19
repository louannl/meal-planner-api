const dbMeals = require('../db/dbMeals');
const dbHandler = require('../db/dbHandlers');
const dbTags = require('../db/dbTags');

exports.createMealTags = async (mealId, mealTags) => {
  const tagNames = mealTags.map((tags) => tags.names);
  const tagExists = await dbMeals.existingNames('tags', tagNames);

  const existingTags = tagExists.map((tag) => tag.name);
  const missingTags = mealTags.filter(
    (tag) => !existingTags.includes(tag.name)
  );
  //create all missing tags
  await dbHandler.insertAll('tags', missingTags);
  //Get all tag ids
  const tagIds = await dbMeals.existingNames('tags', tagNames);
  const allTagIds = tagIds.map((tag) => tag.id);
  //create a meal_tag for each mealTag
  await this.createMealTags(mealId, allTagIds);
};

exports.createMealTags = async (mealId, tagIds) => {
  let placeholders = [];
  for (let i = 0; i < tagIds.length; i + 2) {
    placeholders.push(`($${i + 1}, ${i + 2} )`);
  }

  placeholder = placeholders.join(', ');

  let params = [];
  params = tagIds.forEach((tagId) => {
    params.push(mealId, tagId);
  });

  await dbTags.insertAllMealTags(placeholder, params);
};

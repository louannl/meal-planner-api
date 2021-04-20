const { insert, getExistingIds } = require('../db/dbHandlers');

exports.processMealTags = async (mealId, tags) => {
  const tagIds = await getExistingIds('tags', tags);
  const mealTags = tagIds.map((tagId) => {
    return { meal_id: mealId, tag_id: tagId };
  });
  await insert('meal_tags', mealTags);
};

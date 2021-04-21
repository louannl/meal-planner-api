import { insert, getExistingIds } from '../db/dbHandlers.js';
import { createMissingItems } from './domainHandler.js';

export const processMealTags = async (mealId, tags) => {
  createMissingItems(
    'tags',
    tags.map((tag) => {
      return { name: tag };
    })
  );
  const tagIds = await getExistingIds('tags', tags);
  const mealTags = tagIds.map((tagId) => {
    return { meal_id: mealId, tag_id: tagId };
  });
  await insert('meal_tags', mealTags);
};

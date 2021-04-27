import { insert, selectBy } from '../db/dbHandlers.js';
import { createMissingItems } from './domainHandler.js';

export const processMealTags = async (mealId, tags) => {
  const tagNames = tags.map((tag) => {
    return { name: tag };
  });

  await createMissingItems('tags', tagNames);

  const tagIds = await selectBy('tags', 'id', 'name', tags);

  const mealTags = tagIds.map((tag) => {
    return { meal_id: mealId, tag_id: tag.id };
  });

  await insert('meal_tags', mealTags);
};

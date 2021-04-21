import { getExistingItems, insert } from '../db/dbHandlers.js';

export const createMissingItems = async (table, values) => {
  const names = values.map((value) => value.name);
  const existingItems = await getExistingItems(table, names);
  const missingItems = values.filter(
    (value) => !existingItems.includes(value.name)
  );
  await insert(table, missingItems);
};

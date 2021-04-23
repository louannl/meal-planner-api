import { insert, selectBy } from '../db/dbHandlers.js';

export const createMissingItems = async (table, values) => {
  const names = values.map((value) => value.name);
  const existingItems = await selectBy(table, 'name, id', 'name', names);
  const missingItems = values.filter(
    (value) => !existingItems.includes(value.name)
  );
  await insert(table, missingItems);
};

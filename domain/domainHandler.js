import { insert, selectBy } from '../db/dbHandlers.js';
import AppError from '../utils/appError.js';

export const createMissingItems = async (table, values) => {
  const names = values.map((value) => value.name);
  const existingItems = await selectBy(table, 'name', 'name', names);
  const existingNames = existingItems.map((item) => item.name);
  const missingItems = values.filter(
    (value) => !existingNames.includes(value.name)
  );

  if (missingItems && missingItems.length) {
    return await insert(table, missingItems);
  }

  if (
    (!existingItems || !existingItems.length) &&
    (!missingItems || !missingItems.length)
  ) {
    return new AppError('Create missing items has failed', 500);
  }
};

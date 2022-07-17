import sequelize from '../../sequelize/index.js';

export const createName = (table, name, transaction) => sequelize.models[table].create(
  {
    name,
  },
  { transaction },
);

export const updateName = (table, name, id, transaction) => sequelize.models[table].update(
  {
    name,
  },
  {
    where: { id },
  },
  { transaction },
);

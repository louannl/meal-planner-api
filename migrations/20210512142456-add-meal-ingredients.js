'use strict';

var dbm;
var type;
var seed;

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

//TODO: check if i have implemented foreign key correctly
exports.up = function (db) {
  return db.createTable('meal_ingredients', {
    id: { type: 'int', primaryKey: true },
    meal_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'meal_ingredients_meal_id_fk',
        table: 'meals',
        mapping: 'id',
      },
    },
    ingredient_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'meal_ingredients_ingredient_id_fk',
        table: 'ingredients',
        mapping: 'id',
      },
    },
    amount: { type: 'int', notNull: true },
    unit_type_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'meal_ingredients_unit_type_id_fk',
        table: 'unit_types',
        mapping: 'id',
      },
    },
  });
};

exports.down = function (db) {
  return null;
};

exports._meta = {
  version: 1,
};

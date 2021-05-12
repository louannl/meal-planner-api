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

exports.up = function (db) {
  return db.createTable('meal_days', {
    id: { type: 'int', primaryKey: true },
    meal_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'meal_days_meal_id_fk',
        table: 'meals',
        mapping: 'id',
      },
    },
    day_id: {
      type: 'int',
      notNull: true,
      foreignKey: {
        name: 'meal_days_day_id_fk',
        table: 'days',
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

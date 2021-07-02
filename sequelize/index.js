import { Sequelize } from 'sequelize';
import applyExtraSetup from './extra-setup.js';

const env = process.env.NODE_ENV || 'development';
import envConfig from '../config/moduleConfig.js';
const config = envConfig[env];

import Day from './models/day.model.js';
import Ingredient from './models/ingredient.model.js';
import Meal from './models/meal.model.js';
import Tag from './models/tag.model.js';
import UnitType from './models/unitType.model.js';
import MealDay from './models/mealDay.model.js';
import MealIngredient from './models/mealIngredient.model.js';
import MealTag from './models/mealTag.model.js';
//TODO: Use file reader to avoid all this code??

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
  }
);

const modelDefiners = [
  Day,
  Ingredient,
  Meal,
  Tag,
  UnitType,
  MealDay,
  MealIngredient,
  MealTag,
];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

applyExtraSetup(sequelize);

export default sequelize;

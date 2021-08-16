import { Sequelize } from 'sequelize';
import applyExtraSetup from './extra-setup.js';

const env = process.env.NODE_ENV || 'development';
import envConfig from '../config/moduleConfig.js';
const config = envConfig[env];

import { default as DayModel } from './models/day.model.js';
import { default as IngredientModel } from './models/ingredient.model.js';
import { default as MealModel } from './models/meal.model.js';
import { default as TagModel } from './models/tag.model.js';
import { default as UnitTypeModel } from './models/unitType.model.js';
import { default as MealDayModel } from './models/mealDay.model.js';
import { default as MealIngredientModel } from './models/mealIngredient.model.js';
import { default as MealTagModel } from './models/mealTag.model.js';
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
  DayModel,
  IngredientModel,
  MealModel,
  TagModel,
  UnitTypeModel,
  MealDayModel,
  MealIngredientModel,
  MealTagModel,
];

for (const modelDefiner of modelDefiners) {
  modelDefiner(sequelize);
}

applyExtraSetup(sequelize);

export const Meal = sequelize.models['Meal'];
export const Day = sequelize.models['Day'];
export const Ingredient = sequelize.models['Ingredient'];
export const Tag = sequelize.models['Tag'];
export const UnitType = sequelize.models['UnitType'];
export const MealDay = sequelize.models['MealDay'];
export const MealIngredient = sequelize.models['MealIngredient'];
export const MealTag = sequelize.models['MealTag'];

export default sequelize;

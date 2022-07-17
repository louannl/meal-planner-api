import { Sequelize } from 'sequelize';
import applyExtraSetup from './extra-setup.js';
import envConfig from '../config/moduleConfig.js';

import { default as DayModel } from './models/day.model.js';
import { default as IngredientModel } from './models/ingredient.model.js';
import { default as MealModel } from './models/meal.model.js';
import { default as TagModel } from './models/tag.model.js';
import { default as UnitTypeModel } from './models/unitType.model.js';
import { default as MealDayModel } from './models/mealDay.model.js';
import { default as MealIngredientModel } from './models/mealIngredient.model.js';
import { default as MealTagModel } from './models/mealTag.model.js';

const env = process.env.NODE_ENV || 'development';
const config = envConfig[env];
// TODO: Use file reader to avoid all this code??

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging,
  },
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

modelDefiners.forEach((modelDefiner) => {
  modelDefiner(sequelize);
});

applyExtraSetup(sequelize);

export const { Meal } = sequelize.models;
export const { Day } = sequelize.models;
export const { Ingredient } = sequelize.models;
export const { Tag } = sequelize.models;
export const { UnitType } = sequelize.models;
export const { MealDay } = sequelize.models;
export const { MealIngredient } = sequelize.models;
export const { MealTag } = sequelize.models;

export default sequelize;

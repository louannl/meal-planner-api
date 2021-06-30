import Sequelize from 'sequelize';

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DATABASE_USER,
  process.env.DATABASE_PASSWORD,
  {
    dialect: 'postgres',
  }
);

const models = {
  Days: sequelize.import('./days'),
  Ingredients: sequelize.import('./ingredients'),
  Meals: sequelize.import('./meals'),
  Tags: sequelize.import('./tags'),
  UnitTypes: sequelize.import('./unitTypes'),
  MealDays: sequelize.import('./mealDays'),
  MealIngredients: sequelize.import('./mealIngredients'),
  MealTags: sequelize.import('./mealTags'),
};

Object.keys(models).forEach((key) => {
  if ('associate' in models[key]) {
    models[key].associate(models);
  }
});

export { sequelize };

export default models;

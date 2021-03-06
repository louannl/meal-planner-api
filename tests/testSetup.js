import sequelize from '../sequelize/index.js';

const resetDb = async () => {
  await sequelize.query(
    `TRUNCATE meal_days, meal_ingredients, meal_tags, meals, ingredients, tags 
    RESTART IDENTITY`,
  );
};

export default resetDb;

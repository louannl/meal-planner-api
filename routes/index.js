const meals = require('./mealRoutes');
const tags = require('./tagRoutes');
const days = require('./dayRoutes');
const ingredients = require('./ingredientRoutes');
const unit_types = require('./unit_typeRoutes');

module.exports = (app) => {
  app.use('/meals', meals);
  app.use('/tags', tags);
  app.use('/days', days);
  app.use('/ingredients', ingredients);
  app.use('/unit_types', unit_types);
};

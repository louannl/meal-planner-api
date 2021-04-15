const meals = require('./meals');
const tags = require('./tags');
const days = require('./days');
const ingredients = require('./ingredients');
const unit_types = require('./unit_types');

module.exports = (app) => {
  app.use('/meals', meals);
  app.use('/tags', tags);
  app.use('/days', days);
  app.use('/ingredients', ingredients);
  app.use('/unit_types', unit_types);
};

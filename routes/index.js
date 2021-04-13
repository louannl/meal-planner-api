const meals = require('./meals');
const tags = require('./tags');
//const ingredients = require('/ingredients');

module.exports = (app) => {
  app.use('/meals', meals);
  app.use('/tags', tags);
  //app.use('/ingredients', ingredients);
};

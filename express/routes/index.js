import tags from './tags.js';
import days from './days.js';
import unitTypes from './unitTypes.js';
import ingredients from './ingredients.js';
import meals from './meals.js';

const routes = (app) => {
  app.use('/tags', tags);
  app.use('/days', days);
  app.use('/unit-types', unitTypes);
  app.use('/ingredients', ingredients);
  app.use('/meals', meals);
};

export default routes;

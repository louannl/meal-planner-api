import meals from './mealRoutes.js';
import tags from './tagRoutes.js';
import days from './dayRoutes.js';
import ingredients from './ingredientRoutes.js';
import unit_types from './unit_typeRoutes.js';

const routes = (app) => {
  app.use('/meals', meals);
  app.use('/tags', tags);
  app.use('/days', days);
  app.use('/ingredients', ingredients);
  app.use('/unit_types', unit_types);
};

export default routes;

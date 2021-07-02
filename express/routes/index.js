import days from './days.js';
import unitTypes from './unitTypes.js';
import ingredients from './ingredients.js';

const routes = (app) => {
  app.use('/days', days);
  app.use('/unit-types', unitTypes);
  app.use('/ingredients', ingredients);
};

export default routes;

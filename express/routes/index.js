import days from './days.js';
import unitTypes from './unitTypes.js';

const routes = (app) => {
  app.use('/days', days);
  app.use('/unit-types', unitTypes);
};

export default routes;

import days from './days.js';

const routes = (app) => {
  app.use('/days', days);
};

export default routes;

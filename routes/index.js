import meals from './mealRoutes.js';
import tags from './tagRoutes.js';
import days from './dayRoutes.js';
import ingredients from './ingredientRoutes.js';
import unit_types from './unitTypeRoutes.js';
import health_check from './healthCheck.js';
import AppError from '../utils/appError.js';

const routes = (app) => {
  app.use('/api/meals', meals);
  app.use('/api/tags', tags);
  app.use('/api/days', days);
  app.use('/api/ingredients', ingredients);
  app.use('/api/unit-types', unit_types);
  app.use('/health-check', health_check);
  app.all('*', (req, res, next) => {
    next(
      new AppError(`Route, ${req.originalUrl} not found on this server`, 404)
    );
  });
};

export default routes;

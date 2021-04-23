import meals from './mealRoutes.js';
import tags from './tagRoutes.js';
import days from './dayRoutes.js';
import ingredients from './ingredientRoutes.js';
import unit_types from './unitTypeRoutes.js';
import AppError from '../utils/appError.js';

const routes = (app) => {
  app.use('/meals', meals);
  app.use('/tags', tags);
  app.use('/days', days);
  app.use('/ingredients', ingredients);
  app.use('/unit_types', unit_types);
  app.all('*', (req, res, next) => {
    next(
      new AppError(`Route, ${req.originalUrl} not found on this server`, 404)
    );
  });
};

export default routes;

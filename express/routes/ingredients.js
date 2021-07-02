import Router from 'express-promise-router';
import { getAll, getById } from './helpers.js';

const router = new Router();
export default router;

getAll(router, 'Ingredient');
getById(router, 'Ingredient');

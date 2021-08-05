import Router from 'express-promise-router';
import { create, getAll, getById, remove } from './helpers.js';

const router = new Router();
export default router;

getAll(router, 'Ingredient');
getById(router, 'Ingredient');
create(router, 'Ingredient');
remove(router, 'Ingredient');

import Router from 'express-promise-router';
import {
  create, getAll, getById, remove, update,
} from './helpers.js';

const router = new Router();
export default router;

getAll(router, 'ingredients');
getById(router, 'ingredients');
create(router, 'ingredients');
update(router, 'ingredients');
remove(router, 'Ingredient');

import Router from 'express-promise-router';
import {
  create, getAll, getById, remove,
} from './helpers.js';

const router = new Router();
export default router;

getAll(router, 'Tag');
getById(router, 'Tag');
create(router, 'Tag');
remove(router, 'Tag');

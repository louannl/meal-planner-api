import Router from 'express-promise-router';
import {
  create, getAll, getById, remove,
} from './helpers.js';

const router = new Router();
export default router;

getAll(router, 'tags');
getById(router, 'tags');
create(router, 'Tag');
remove(router, 'Tag');

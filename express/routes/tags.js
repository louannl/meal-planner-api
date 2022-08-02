import Router from 'express-promise-router';
import {
  create, getAll, getById, remove, update,
} from './helpers.js';

const router = new Router();
export default router;

getAll(router, 'tags');
getById(router, 'tags');
create(router, 'tags');
update(router, 'tags');
remove(router, 'Tag');

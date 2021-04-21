import Router from 'express-promise-router';
import { getAll, getOne } from './handler.js';

const router = new Router();
export default router;

getAll(router, 'days');
getOne(router, 'days');

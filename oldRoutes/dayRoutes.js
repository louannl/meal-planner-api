import Router from 'express-promise-router';
import { getAll, getOne } from './routeHandler.js';

const router = new Router();
export default router;

getAll(router, 'days');
getOne(router, 'days');

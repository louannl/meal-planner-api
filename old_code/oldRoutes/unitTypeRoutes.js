import Router from 'express-promise-router';
import * as handler from './routeHandler.js';

const router = new Router();
export default router;

const name = 'unit_types';

handler.getAll(router, name);
handler.getOne(router, name);

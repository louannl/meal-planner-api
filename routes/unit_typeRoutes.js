import Router from 'express-promise-router';
import * as handler from './handler.js';

const router = new Router();
export default router;

handler.getAll(router, 'unit_types');
handler.getOne(router, 'unit_types');

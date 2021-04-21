import Router from 'express-promise-router';
import * as handler from './handler.js';

const router = new Router();
export default router;

const name = 'tags';

handler.getAll(router, name);
handler.getOne(router, name);
handler.createOne(router, name);
handler.updateOne(router, name);
handler.deleteOne(router, name);
handler.deleteAll(router, name);

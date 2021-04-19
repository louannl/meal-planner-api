const Router = require('express-promise-router');
const handler = require('./handler');

const router = new Router();
module.exports = router;

const name = 'tags';

handler.getAll(router, name);
handler.getOne(router, name);
handler.createOne(router, name);
handler.updateOne(router, name);
handler.deleteOne(router, name);
handler.deleteAll(router, name);

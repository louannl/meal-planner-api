const Router = require('express-promise-router');
const handler = require('./handler');

const router = new Router();
module.exports = router;

handler.getAll(router, 'unit_types');
handler.getOne(router, 'unit_types');

const Router = require('express-promise-router');
const handler = require('./handler');

const router = new Router();
module.exports = router;

handler.getAll(router, 'days');
handler.getOne(router, 'days');

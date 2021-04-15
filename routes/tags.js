const Router = require('express-promise-router');
const handler = require('./handler');

const router = new Router();
module.exports = router;

handler.getAll(router, 'tags');
handler.getOne(router, 'tags');
handler.createOne(router, 'tags');
handler.updateOne(router, 'tags');
handler.deleteOne(router, 'tags');

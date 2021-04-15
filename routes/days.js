const Router = require('express-promise-router');
const handler = require('./handler');

const router = new Router();
module.exports = router;

//GET ALL DAYS
handler.getAll(router, 'days');
//GET DAY

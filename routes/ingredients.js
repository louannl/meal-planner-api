const Router = require('express-promise-router');
const handler = require('./handler');

const router = new Router();
module.exports = router;

handler.getAll(router, 'ingredients');
handler.getOne(router, 'ingredients');
handler.deleteOne(router, 'ingredients');
handler.deleteAll(router, 'ingredients');
//ADD INGREDIENT
//EDIT INGREDIENT

const Router = require('express-promise-router');
const handler = require('./handler');

const router = new Router();
module.exports = router;

handler.getAll(router, 'ingredients');
handler.getOne(router, 'ingredients');
handler.deleteOne(router, 'ingredients');
//ADD INGREDIENT
//DELETE INGREDIENT
//EDIT INGREDIENT

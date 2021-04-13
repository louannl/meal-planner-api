const Router = require('express-promise-router');
const db = require('../db');

const tagExists = async (name) => {
  const { rowCount } = await db.query('SELECT id FROM tags WHERE name = $1', [
    name,
  ]);

  return rowCount > 0;
};

const router = new Router();
module.exports = router;

//GET TAG by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { rows, rowCount } = await db.query(
    'SELECT * FROM tags WHERE id = $1',
    [id]
  );

  if (rowCount === 0) {
    return res.sendStatus(404);
  }

  res.send(rows[0]);
});

router.post('/', async (req, res) => {
  const { name } = req.body;

  if (await tagExists(name)) {
    return res.sendStatus(200);
  }

  const { rowCount } = await db.query('INSERT INTO tags (name) VALUES ($1)', [
    name,
  ]);

  if (rowCount === 1) {
    return res.sendStatus(200);
  }

  res.sendStatus(500);
});

//CREATE TAG

//EDIT TAG
//DELETE TAG

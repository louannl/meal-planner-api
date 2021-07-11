import Router from 'express-promise-router';

const router = new Router();
router.get('/', async (req, res) => {
  res.status(200).json({ status: 'success' });
});

export default router;

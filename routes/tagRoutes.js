import Router from 'express-promise-router';
import validate from '../utils/validate.js';
import { checkSchema } from 'express-validator';
import { deleteTag } from '../domain/tags.js';
import { getErrorType } from '../utils/appError.js';
import * as handler from './routeHandler.js';

const router = new Router();
export default router;

const name = 'tags';

handler.getAll(router, name);
handler.getOne(router, name);
handler.createOne(router, name);
handler.updateOne(router, name);
// handler.deleteAll(router, name);

router.delete(
  '/delete-tag',
  validate(
    checkSchema({
      name: {
        errorMessage: 'Tag name is not valid',
        notEmpty: true,
        in: 'body',
      },
    })
  ),
  async (req, res) => {
    const { name } = req.body;
    try {
      await deleteTag(name);
      res.status(204).json({
        status: 'success',
      });
    } catch (error) {
      getErrorType(error);
    }
  }
);

import Router from 'express-promise-router';
import { checkSchema } from 'express-validator';
import prisma from '../../prisma.js';
import { getErrorType } from '../../utils/appError.js';
import validate from '../../utils/validate.js';

const router = new Router();
export default router;

router.get('/', async (req, res) => {
  try {
    return res.status(200).json({
      status: 'success',
      data: await prisma.unit_types.findMany({
        select: {
          id: true,
          name: true,
          symbol: true,
        },
      }),
    });
  } catch (error) {
    return getErrorType(error, 'UnitType');
  }
});

router.get(
  '/:id',
  validate(
    checkSchema({
      id: {
        errorMessage: 'ID is not valid',
        notEmpty: true,
        in: 'params',
        isInt: true,
        toInt: true,
      },
    }),
  ),
  async (req, res) => {
    try {
      const { id } = req.params;

      const result = await prisma.unit_types.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          symbol: true,
        },
      });

      if (!result) {
        return res
          .status(404)
          .send('UnitType with the specified ID does not exist');
      }

      return res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      return getErrorType(error, 'UnitType');
    }
  },
);

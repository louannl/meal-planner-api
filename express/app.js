import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

import mountRoutes from './routes/index.js';
mountRoutes(app);

function makeHandlerAwareOfAsyncErrors(handler) {
  return async function (req, res, next) {
    try {
      await handler(req, res);
    } catch (error) {
      next(error);
    }
  };
}

//define standard routes if applicable

// for (const [routeName, routeController] of Object.entries(routes)) {
// 	if (routeController.getAll) {
// 		app.get(
// 			`/api/${routeName}`,
// 			makeHandlerAwareOfAsyncErrors(routeController.getAll)
// 		);
// 	}
// }

export default app;

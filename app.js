import express from 'express';
import { sequelize } from './models';

import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

import mountRoutes from './routes/index.js';
const port = 5000;

sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`),
  });
});

mountRoutes(app);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
//TODO: error for all routes not used

import express from 'express';
import cors from 'cors';

import mountRoutes from './routes/index.js';

const app = express();
app.use(cors());
app.use(express.json());
mountRoutes(app);

app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

export default app;

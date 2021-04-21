import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

import mountRoutes from './routes/index.js';
const port = 5000;

mountRoutes(app);
app.listen(port, () => {
  console.log(`server has started on port ${port}`);
});

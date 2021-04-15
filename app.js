const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const mountRoutes = require('./routes');
const port = 5000;

mountRoutes(app);
app.listen(port, () => {
  console.log(`server has started on port ${port}`);
});

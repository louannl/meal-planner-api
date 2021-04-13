const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cors = require('cors');
const mountRoutes = require('./routes');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json()); //used to parse json bodies, don't need bodyParser for this.
mountRoutes(app);
app.listen(port, () => {
  console.log(`server has started on port ${port}`);
});

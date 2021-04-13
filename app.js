const express = require('express');
const app = express();
const port = 5000;
const cors = require('cors');
const pool = require('./db');

app.use(cors());
app.use(express.json()); //used to parse json bodies, don't need bodyParser for this.

//GET MEAL/:id
//POST MEAL
//PUT MEAL/:id
//DELETE MEAL/:id

//GET ALL MEALS

//GET ALL INGREDIENTS --not sure if needed as can be requested with all meals

app.listen(port, () => {
  console.log(`server has started on port ${port}`);
});

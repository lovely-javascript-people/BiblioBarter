const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const bodyParser = require('body-parser');
const sequelize = require('../database/database.js').sequelize;
app.use(bodyParser.json())
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/matches', (req, res) => res.send(JSON.stringify('Hello World!')))

app.listen(port, () => console.log(`Biblio server listening on port ${port}!`))

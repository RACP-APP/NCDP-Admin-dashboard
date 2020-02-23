const express = require('express');
const Articles = express.Router();
const bodyParser = require('body-parser');
const path = require('path');

Articles.use(bodyParser.json());
Articles.use(bodyParser.urlencoded({ extended: true }));

Articles.get('/Articles', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );
  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization'
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );

  res.send(' you are Articles in ');
});

module.exports = Articles;

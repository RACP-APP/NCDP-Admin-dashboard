const express = require('express');
const Dashbord = express.Router();
const bodyParser = require('body-parser');
const path = require('path');

Dashbord.use(bodyParser.json());
Dashbord.use(bodyParser.urlencoded({ extended: true }));

Dashbord.get('/Dashbord', (req, res) => {
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

  res.send(' you are Dashbord in ');
});

module.exports = Dashbord;

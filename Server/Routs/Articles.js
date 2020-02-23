//------------------------------------------------------//
//-------------include all necessary libraries ---------//
//------------------------------------------------------//
const express = require('express');
const Articles = express.Router();
const bodyParser = require('body-parser');
const path = require('path');

//------------------------------------------------------//
//------------- use Wanted Libraries -------------------//
//------------------------------------------------------//
Articles.use(bodyParser.json());
Articles.use(bodyParser.urlencoded({ extended: true }));

Articles.get('/Articles', (req, res) => {
  //------------------------------------------------------//
  //------------- remove cors Origin Error ---------------//
  //------------------------------------------------------//
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

  //----------------------------------------------------------//
  //------------- send a response to the route ---------------//
  //----------------------------------------------------------//
  res.send(' you are Articles in ');
});

module.exports = Articles;

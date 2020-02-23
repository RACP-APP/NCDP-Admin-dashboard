//------------------------------------------------------//
//-------------include all necessary libraries ---------//
//------------------------------------------------------//
const express = require('express');
const Login = express.Router();
const bodyParser = require('body-parser');
const path = require('path');

//------------------------------------------------------//
//------------- use Wanted Libraries -------------------//
//------------------------------------------------------//
Login.use(bodyParser.json());
Login.use(bodyParser.urlencoded({ extended: true }));

Login.get('/login', (req, res) => {
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
  res.send(' you are ologged in ');
});

module.exports = Login;

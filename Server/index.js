//------------------------------------------------------//
//-------------include all necessary libraries ---------//
//------------------------------------------------------//
const express = require('express');
const app = express();
const PORT = (process.env.PORT = 3005);
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

//------------------------------------------------------//
//-------------Using all routes for our Server ---------//
//------------------------------------------------------//
app.use(require('./Routs/LogIn'));
app.use(require('./Routs/Articles'));
app.use(require('./Routs/Dashbord'));

//------------------------------------------------------//
//-------------Listen to our Port Number ---------------//
//------------------------------------------------------//
app.listen(PORT, function() {
  console.log('Server is running at PORT:', PORT);
});

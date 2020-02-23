const express = require('express');
const app = express();
const PORT = (process.env.PORT = 3004);

let router = express.Router();

var routes = require('./Routs/Login');
app.use('/', router);

app.listen(PORT, function() {
  console.log('Server is running at PORT:', PORT);
});

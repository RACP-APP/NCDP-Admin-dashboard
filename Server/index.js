const express = require('express');
const app = express();
const PORT = (process.env.PORT = 3004);

app.use(express.static('public'));

//Routes
app.use(require('./Routs/LogIn'));
app.use(require('./Routs/Articles'));
app.use(require('./Routs/Dashbord'));

// let router = express.Router();
// app.use(express.static('public'));
// var routes = require('./Routs/Login');
// app.use('/login', router);

app.listen(PORT, function() {
  console.log('Server is running at PORT:', PORT);
});

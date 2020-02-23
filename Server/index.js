const express = require('express');
const app = express();
const PORT = (process.env.PORT = 3005);
// const path = require('path');
// const cors = require('cors');

// app.use(cors);
app.use(express.static('public'));

//Using all routes for our Server
app.use(require('./Routs/LogIn'));
app.use(require('./Routs/Articles'));
app.use(require('./Routs/Dashbord'));

// app.get('/', (res, req) => {});

app.listen(PORT, function() {
  console.log('Server is running at PORT:', PORT);
});

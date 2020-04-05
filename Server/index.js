//------------------------------------------------------//
//-------------include all necessary libraries ---------//
//------------------------------------------------------//
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3005;
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
var multer = require('multer');
const favicon = require('express-favicon');
const fs = require('fs');
// const db = fb.firestore();

const cssPath = path.join(__dirname, '../public');

// Get a reference to the storage service, which is used to create references in your storage bucket

app.use('/public', express.static(cssPath));
app.use(express.static(path.join(__dirname, '../build')));
app.use(favicon(__dirname + '../build/favicon.ico'));

app.get('/contactus', (req, res) => {
  // res.render(path.join(__dirname, '../public/views/contact'));
});
//------------------------------------------------------//
//-------------Using all routes for our Server ---------//
//------------------------------------------------------//
app.use(require('./Routs/LogIn'));
app.use(require('./Routs/Articles'));
app.use(require('./Routs/Dashbord'));

//---------------------------------------------------------------------------------------------------------//
//--------------- arout to generat json file and send it to the mobile app --------------------------------//
//--------------------------------------------------------------------------------------------------------//
app.post('/WriteSocialIconsData', function(req, res) {
  var file = path.join(
    __dirname,
    '../src/Components/userSettings/FooterData.json'
  );
  console.log('hiiiiiiiiiiiiiiiiiiiiii');
  var data = req.body.data;
  fs.writeFile(file, JSON.stringify(data), error => {
    if (error) {
      console.log(error);
      res
        .status(500)
        .send('An Error Occurred During Processing')
        .end();
    } else {
      res
        .status(200)
        .send('done')
        .end();
    }
  });
});

//---------------------------------------------------------------------------------------------------------//
//--------------- arout to generat json file and send it to the mobile app --------------------------------//
//--------------------------------------------------------------------------------------------------------//
app.get('/JSONFile', async function(req, res) {
  const CreatJSON = await require('../db/JsonGenrator').creatJson();

  res.sendFile(path.join(__dirname, '../', 'phraseFreqs.json'));
});

app.get('*', function(req, res) {
  console.log('ddddddddddddddddddd');
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.post('/Chart', (req, res) => {
  console.log(req.body.data);
  res
    .status(200)
    .send(' recived sucssifully')
    .end();
});

//------------------------------------------------------//
//-------------Listen to our Port Number ---------------//
//------------------------------------------------------//
app.listen(PORT, function() {
  console.log('Server is running at PORT:', PORT);
});

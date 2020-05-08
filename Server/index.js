//-------------------------------------------------------------------------------------------------------------//
//--------------------------------------include all necessary libraries ---------------------------------------//
//-------------------------------------------------------------------------------------------------------------//
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
var multer = require('multer');
const favicon = require('express-favicon');
const fs = require('fs');
const db = require('../db/models');
var multer = require('multer');

const messaging = require('./send');

const cssPath = path.join(__dirname, '../public');
var upload = multer({ dest: 'uploads/' });
// Get a reference to the storage service, which is used to create references in your storage bucket

app.use('/public', express.static(cssPath));
app.use(express.static(path.join(__dirname, '../build')));
app.use(favicon(__dirname + '../build/favicon.ico'));
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

// app.get('/contactus', (req, res) => {
//   // res.render(path.join(__dirname, '../public/views/contact'));
// });
//---------------------------------------------------------------------------------------------------------//
//-------------------------------Using all routes for our Server ------------------------------------------//
//---------------------------------------------------------------------------------------------------------//
app.use(require('./Routs/LogIn'));
app.use(require('./Routs/Articles'));
app.use(require('./Routs/Dashbord'));

//---------------------------------------------------------------------------------------------------------//
//------------------------  Save Updates for Notifications ------------------------------------------------//
//---------------------------------------------------------------------------------------------------------//

app.post('/UpdateNotification', upload.single('file'), (req, res) => {
  // console.log(req.files[0]);
  var myFile = path.join(__dirname, '../uploads', req.file.filename);
  try {
    var json = JSON.parse(fs.readFileSync(myFile, 'utf8'));
    console.log(json['data']);
    db.UpdateNotification(json.data, (error, result) => {
      if (error) {
        res
          .status(500)
          .send('An Error Happend While processing the data')
          .end();
      } else {
        fs.unlink(myFile, function (err) {
          if (err) console.log('File not deleted!');
          // if no error, file has been deleted successfully
          console.log('File deleted!');
        });
        res.status(200).send('Done').end();
      }
    });
    // res.status(200).send(json).end();
  } catch (err) {
    res.send(400);
  }
});

app.get('/UpdateNotifiCount', (req, res) => {
  var file = path.join(__dirname, '../data', 'NotifCount.json');
  var json = fs.readFileSync(file, 'utf8');
  var countObject = JSON.parse(json);
  ++countObject.count;
  fs.writeFile(file, JSON.stringify(countObject), (error) => {
    if (error) {
      console.log(error);
      res.status(500).send('حدث خطأ أثناء معالجة').end();
    } else {
      //------------------------------------------ get json from file -------------------------------------//
      res.status(200).send('done').end();
    }
  });
});
//--------------------------------------------------------------------------------------------------------//
//------------------------- A rout to send a notifications to all reigistered Mobile ---------------------//
//--------------------------------------------------------------------------------------------------------//
app.get('/sendNotification', (req, res) => {
  db.getRegistrationTokens((error, result) => {
    if (error) {
      res
        .status(500)
        .send('حدث خطأ بإسترجاع المعلومات . يرجى إعادة المحاولة ')
        .end();
    } else {
      messaging.sendMessage(result, (error) => {
        if (error) {
          res.status(500).send('حصل مشكله أثناء ارسال الإشعارات').end();
        } else {
          res.status(200).send('تم ارسال الاشعارات بنجاح').end();
        }
      });
    }
  });
});

//---------------------------------------------------------------------------------------------------------//
//--------------- arout to generat json file and send it to the mobile app --------------------------------//
//---------------------------------------------------------------------------------------------------------//
app.post('/WriteSocialIconsData', function (req, res) {
  var file = path.join(__dirname, '../data', 'FooterData.json');
  var data = req.body.data;
  fs.writeFile(file, JSON.stringify(data), (error) => {
    if (error) {
      console.log(error);
      res.status(500).send('حدث خطأ أثناء معالجة').end();
    } else {
      res.status(200).send('تم').end();
    }
  });
});

//---------------------------------------------------------------------------------------------------------//
//--------------------- arout to generat json file and to View Charts -------------------------------------//
//---------------------------------------------------------------------------------------------------------//
app.post('/Chart', function (req, res) {
  //----------------------------------------- get the file position ---------------------------------------//
  var file = path.join(__dirname, '../data', 'ChartData.json');
  var data = req.body.data;
  //----------------------------------------- read file from server ---------------------------------------//
  fs.writeFile(file, JSON.stringify(data), (error) => {
    if (error) {
      console.log(error);
      res.status(500).send('حدث خطأ أثناء معالجة').end();
    } else {
      //------------------------------------------ get json from file -------------------------------------//
      res.status(200).send('done').end();
    }
  });
});

//---------------------------------------------------------------------------------------------------------//
//--------------------- arout to generat json file and to View Charts -------------------------------------//
//---------------------------------------------------------------------------------------------------------//
app.get('/GetChart', function (req, res) {
  //----------------------------------------- get the file position ---------------------------------------//
  var file = path.join(__dirname, '../data', 'ChartData.json');
  //----------------------------------------- read file from server ---------------------------------------//
  var json = fs.readFileSync(file);
  //------------------------------------------ get json from file -----------------------------------------//
  res.status(200).send(JSON.parse(json)).end();
});

//---------------------------------------------------------------------------------------------------------//
//--------------- arout to generat json file and send it to the mobile app --------------------------------//
//---------------------------------------------------------------------------------------------------------//
app.get('/JSONFile', async function (req, res) {
  const CreatJSON = await require('../db/JsonGenrator').creatJson(
    (error, result) => {
      if (error) {
        res.status(500).send(error).end();
      } else {
        res
          .status(200)
          .sendFile(path.join(__dirname, '../db/', 'phraseFreqs.json'));
      }
    }
  );

  setTimeout(600, () => {});

  //------------------------------------------ get json from file -----------------------------------------//
});

//---------------------------------- Get Footer Json -------------------------------------------------------//
app.get('/GetFooterJson', function (req, res) {
  //----------------------------------------- get the file position ---------------------------------------//
  var file = path.join(__dirname, '../data', 'FooterData.json');
  //----------------------------------------- read file from server ---------------------------------------//
  var json = fs.readFileSync(file);
  //------------------------------------------ get json from file -----------------------------------------//
  res.status(200).send(JSON.parse(json)).end();
});

// //------------------------------------ Set Footer json ------------------------------------------------------//
// app.post('/UpdateFooterJson', (req, res) => {
//   //----------------------------------------- get the file position ---------------------------------------//
//   var file = path.join(__dirname, '../data', 'FooterData.json');

//   var data = req.body.data;

//   fs.writeFile(file, JSON.stringify(data), (error) => {
//     if (error) {
//       console.log(error);
//       res.status(500).send('حدث خطأ أثناء معالجة').end();
//     } else {
//       //------------------------------------------ get json from file -------------------------------------//
//       res.status(200).send('done').end();
//     }
//   });
// });
//------------------------------------- for any other request ----------------------------------------------//
app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

//-----------------------------------------------------------------------------------------------------------//
//-----------------------------------Listen to our Port Number ----------------------------------------------//
//-----------------------------------------------------------------------------------------------------------//
app.listen(PORT, function () {
  console.log('Server is running at PORT:', PORT);
});

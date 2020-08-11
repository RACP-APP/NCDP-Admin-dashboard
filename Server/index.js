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
var http = require('http');
var socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server); // < Interesting!
(exec = require('child_process').exec), (util = require('util'));
var Files = {};
//------------------- Connectining the Scoket ---------------------//

var soket2 = io.on('connection', (socket) => {
  console.log('New client connected');
  var Files = [];

  socket.on('disconnect', () => {
    console.log(' disconnected from Server');
  });

  //----------------------------------------------------------------------------------------------//

  socket.on('Start', function (data) {
    //data contains the variables that we passed through in the html file
    var Name = data['Name'];

    Files[Name] = {
      //Create a new Entry in The Files Variable
      FileSize: data['Size'],
      Data: '',
      Downloaded: 0,
    };
    var Place = 0;
    try {
      var Stat = fs.statSync('public/uploads/' + Name);
      if (Stat.isFile()) {
        console.log(Files[Name]['Downloaded']);
        Files[Name]['Downloaded'] = Stat.size;
        Place = Stat.size / 524288;
      }
    } catch (er) {
      // socket.emit('error', { error: er });
      // socket.socket.reconnect();
    } //It's a New File

    fs.open('public/uploads/' + Name, 'a', function (err, fd) {
      if (err) {
        socket.emit('error', { error: er });
      } else {
        Files[Name]['Handler'] = fd; //We store the file handler so we can write to it later
        socket.emit('MoreData', {
          Place: Place,
          Percent: 0,
        });
      }
    });
  });
  //--------------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------Uplading Event for the file -------------------------------------------------------//
  //-------------- this event checks the file size if its larg then it creats a hsndler a cuts te file -----------------------//
  //------------------------------------------into chunks and then upload each cunk a lone -----------------------------------//
  //--------------------------------------------------------------------------------------------------------------------------//

  socket.on('delete', (data) => {
    console.log('deleting');
    fs.unlink('public/uploads/HarvardXCS50W-V000100_DTH.mp4', function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('dooooooooooooon deleteing');
      }
    });
  });

  socket.on('reconnect', (data) => {
    var Name = data['Name'];
    Files[Name]['Downloaded'] += data['Data'].length;
    Files[Name]['Data'] += data['Data'];
    var Place = Files[Name]['Downloaded'] / 524288;
    var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
    socket.emit('MoreData', { Place: Place, Percent: Percent });
  });

  socket.on('Upload', function (data) {
    console.log('uploading -----------------------');

    var Name = data['Name'];
    Files[Name]['Downloaded'] += data['Data'].length;
    Files[Name]['Data'] += data['Data'];

    //-------------------- if the Uploading Size the Same as the File Size then we are Done ------------------//
    if (Files[Name]['Downloaded'] == Files[Name]['FileSize']) {
      //If File is Fully Uploaded
      fs.write(
        Files[data['Name']]['Handler'],
        Files[data['Name']]['Data'],
        null,
        'Binary',
        function (err, Writen) {
          if (!err) {
            console.log('uploading is completerd');

            socket.emit('Done', { Image: 'public/' + Name + '.jpg' });
          } else {
            socket.emit('error', { error: er });
          }
        }
      );
    } //-------------------- if the file Size More Than 10485760 creat a handler and then cut the chunk a part ------------------//
    else if (Files[Name]['Data'].length > 10485760) {
      //If the Data Buffer reaches 10MB
      fs.write(
        Files[Name]['Handler'],
        Files[Name]['Data'],
        null,
        'Binary',
        function (err, Writen) {
          if (err) {
            socket.emit('error', { error: er });
          } else {
            Files[Name]['Data'] = ''; //Reset The Buffer
            var Place = Files[Name]['Downloaded'] / 524288;
            var Percent =
              (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
            socket.emit('MoreData', { Place: Place, Percent: Percent });
          }
        }
      );
    } else {
      //-------------------- if the file Size smaller Than 10485760 creat a handler and then cut the file into chunks ------------------//
      var Place = Files[Name]['Downloaded'] / 524288;
      var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
      socket.emit('MoreData', { Place: Place, Percent: Percent });
    }
  });

  //----------------------------------------------------------------------------------------------//
});
const messaging = require('./send');
const creatChartjson = require('../db/CreatChartJSON');
const cssPath = path.join(__dirname, '../public');
var upload = multer({ dest: 'uploads/' });
// Get a reference to the storage service, which is used to create references in your storage bucket

app.use('/public', express.static(cssPath));
app.use(express.static(path.join(__dirname, '../build')));
app.use(favicon(__dirname + '../build/favicon.ico'));
var multer = require('multer');
const { thatReturns } = require('react-simple-audio-player');
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

//--------------------------------------------------------------------------------------------------------//
//-------------------------------------------- Image Uploading -------------------------------------------//
//--------------------------------------------------------------------------------------------------------//

app.post('/UploadingImage', (req, res) => {
  var name = req.body.name;
  var type = req.body.type;
  var data = req.body.data;
  // var reExpr = new RegExp('/^data:image' + '\\' + '/' + type + ';base64,/');
  console.log(data.indexOf(','));
  // console.log('type', type, 'name', name, data);

  fs.writeFile(
    'public/uploads/Images/' + name,
    data.substr(data.indexOf(',') + 1),
    'base64',
    (err) => {
      if (err) {
        res
          .status(500)
          .send('خصل خطأ أثناء التحميل الرجاء المحاولة مرة أخرى ')
          .end();
      } else {
        res.status(200).send('تم تحميل الملف بنجاخ ').end();
      }
    }
  );
});

//---------------------------------------------------------------------------------------------------------//
//------------------------  Save Updates for Notifications ------------------------------------------------//
//---------------------------------------------------------------------------------------------------------//

app.post('/UpdateNotification', upload.single('file'), (req, res) => {
  // console.log(req.files[0]);
  // var myFile = path.join(__dirname, '../uploads', req.file.filename);

  console.log(req.body, 'fffffffffffff');
  // var json = JSON.parse(fs.readFileSync(myFile, 'utf8'));
  // console.log(json['data']);
  db.UpdateNotification(req.body['data'], (error, result) => {
    if (error) {
      res.status(500).send('An Error Happend While processing the data').end();
    } else {
      // fs.unlink(myFile, function (err) {
      //   if (err) console.log('File not deleted!');
      //   // if no error, file has been deleted successfully
      //   console.log('File deleted!');
      // });
      res.status(200).send('Done').end();
    }
  });
  // res.status(200).send(json).end();
});

app.get('/UpdateNotifiCount', (req, res) => {
  var file = path.join(__dirname, '../data', 'NotifCount.json');
  var json = fs.readFileSync(file, 'utf8');
  var countObject = JSON.parse(json);
  ++countObject.count;
  fs.writeFile(file, JSON.stringify(countObject), (error) => {
    if (error) {
      console.log(error);
      res.sendStatus(500).send('حدث خطأ أثناء معالجة').end();
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

//--------------------------------------------------------------------------------------------------------//

app.post('/CreraJsonChart', (req, res) => {
  if (req.body.type === 'TimeReviwed') {
    creatChartjson.GetTimeandTimeSpent((TimeReviwed) => {
      if (!!TimeReviwed) {
        res.status(200).send({ TimeReviwed: TimeReviwed }).end();
      } else {
        res.status(500).send('error');
      }
    });
  } else if (req.body.type === 'appDownload') {
    creatChartjson.getRegisteration('2020', (appDownload) => {
      if (!!appDownload) {
        res.status(200).send({ appDownload: appDownload }).end();
      } else {
        res.status(500).send('error').end();
      }
    });
  }
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
server.listen(PORT, function () {
  console.log('Server is running at PORT:', PORT);
});

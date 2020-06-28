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

// function handler(req, res) {
//   fs.readFile(__dirname + '/index.html', function (err, data) {
//     if (err) {
//       res.writeHead(500);
//       return res.end('Error loading index.html');
//     }
//     res.writeHead(200);
//     res.end(data);
//   });
// }

// let interval;
io.on('connection', (socket) => {
  console.log('New client connected');
  var Files = [];

  // if (interval) {
  //   clearInterval(interval);
  // }
  // interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    // clearInterval(interval);
  });

  //----------------------------------------------------------------------------------------------//

  socket.on('Start', function (data) {
    // var Files = [];
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
      var Stat = fs.statSync('uploads/' + Name);
      if (Stat.isFile()) {
        console.log(Files[Name]['Downloaded']);
        Files[Name]['Downloaded'] = Stat.size;
        Place = Stat.size / 524288;
      }
    } catch (er) {
      console.log('error', er);
    } //It's a New File
    fs.open('uploads/' + Name, 'a', function (err, fd) {
      if (err) {
        console.log(err);
      } else {
        Files[Name]['Handler'] = fd; //We store the file handler so we can write to it later
        socket.emit('MoreData', {
          Place: Place,
          Percent: 0,
        });
      }
    });
  });
  //----------------------------------------------------------------------------------------------//

  socket.on('Upload', function (data) {
    console.log('uploading -----------------------');

    var Name = data['Name'];
    // console.log('1111111111111111111', Name, data['Data'].length);

    // if (Files.hasOwnProperty(Name)) {
    //   console.log('hasprp');
    //   if (Files[Name].hasOwnProperty('Downloaded')) {
    //     console.log('hasOwnProperty - Downloaded', data['Data'].length);
    //     Files[Name]['Downloaded'] += data['Data'].length;
    //   } else {
    //     console.log('do not hasOwnProperty - Downloaded');
    //     Files[Name]['Downloaded'] = data['Data'].length;
    //   }
    // } else {
    //   console.log('do not hasprp');
    //   Files[Name] = {};
    // }

    Files[Name]['Downloaded'] += data['Data'].length;
    Files[Name]['Data'] += data['Data'];
    console.log(
      " Files[Name]['Downloaded']",
      Files[Name]['Downloaded'],
      " Files[Name]['Data']",
      Files[Name]['Data'],
      "data['Data']",
      data['Data'],
      '------------------------'
    );
    if (Files[Name]['Downloaded'] == Files[Name]['FileSize']) {
      //If File is Fully Uploaded
      fs.write(
        Files[data['Name']]['Handler'],
        Files[data['Name']]['Data'],
        null,
        'Binary',
        function (err, Writen) {
          //Get Thumbnail Here
        }
      );
    } else if (Files[Name]['Data'].length > 10485760) {
      //If the Data Buffer reaches 10MB
      fs.write(
        Files[Name]['Handler'],
        Files[Name]['Data'],
        null,
        'Binary',
        function (err, Writen) {
          Files[Name]['Data'] = ''; //Reset The Buffer
          var Place = Files[Name]['Downloaded'] / 524288;
          var Percent =
            (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
          socket.emit('MoreData', { Place: Place, Percent: Percent });
        }
      );
    } else {
      console.log('99999999999999999999999', Name);

      var Place = Files[Name]['Downloaded'] / 524288;
      var Percent = (Files[Name]['Downloaded'] / Files[Name]['FileSize']) * 100;
      console.log(
        '99999999999999999999999',
        Name,
        Place,
        Percent
        // Files[Name]['Downloaded']
      );
      socket.emit('MoreData', { Place: Place, Percent: Percent });
    }
  });

  //----------------------------------------------------------------------------------------------//

  //-----------------------------------------------------------------------------------//

  // socket.on('MoreData', function (data) {
  //   UpdateBar(data['Percent']);
  //   var Place = data['Place'] * 524288; //The Next Blocks Starting Position
  //   var NewFile; //The Variable that will hold the new Block of Data
  //   // if (SelectedFile.webkitSlice)
  //   //   NewFile = SelectedFile.webkitSlice(
  //   //     Place,
  //   //     Place + Math.min(524288, SelectedFile.size - Place)
  //   //   );
  //   // else
  //   //   NewFile = SelectedFile.mozSlice(
  //   //     Place,
  //   //     Place + Math.min(524288, SelectedFile.size - Place)
  //   //   );
  //   FReader.readAsBinaryString(NewFile);
  // });
});

var d = 0;
const getApiAndEmit = async (socket) => {
  socket.emit('FromAPI', d++);
};

//--------------------------------//

const messaging = require('./send');
const creatChartjson = require('../db/CreatChartJSON');
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

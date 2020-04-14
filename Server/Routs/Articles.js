//------------------------------------------------------//
//-------------include all necessary libraries ---------//
//------------------------------------------------------//
const express = require('express');
const Articles = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
var multer = require('multer');
const db = require('../../db/models');
const fs = require('fs');
const pdf = require('pdf-parse');
var mammoth = require('mammoth');

//------------------------------------------------------//
//------------- use Wanted Libraries -------------------//
//------------------------------------------------------//
Articles.use(bodyParser.json());
Articles.use(bodyParser.urlencoded({ extended: true }));

//--------------------------------------------- ahelper function to convert the Dom to a regular String ---------------------------------------//

convertDomToHtmlString = (HTMLContent) => {
  return HTMLContent.toString()
    .replace(/\\/g, '\\\\')
    .replace(/"/g, '\\"')
    .replace(/[\n\r]/g, '\\n');
};
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
  res.send(' انت الآن بالمقالات ');
});

Articles.post('/Articles/upload', (req, res) => {
  console.log('in the articals upload');
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
});

Articles.post('/Articles/UpdateArticle', (req, res) => {
  // console.log('in the articals update');
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
  console.log(
    req.body.UpdateDate,

    '--------------------------------------------------'
  );
  db.UpdateArticle(
    req.body.ID,
    req.body.Title,
    req.body.not,
    req.body.icon,
    req.body.UpdateDate,
    req.body.UpdateByUser,
    (eror, result) => {
      if (eror) {
        res.status(500).send('خطأ بمعالجة البيانات').end();
      } else res.status(200).send(result).end();
    }
  );
});

//----------------------------------------------------------------- PDF Converter -------------------------------------------------------------------------//
Articles.post('/Articles/convertPDF', (req, res) => {
  // console.log('in the convertPDF upload');
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

  //--------------------------------------- a function that takes the files from the dataform and upload it to the server---------------------------//
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) {
      return res.status(500).json(err);
    } else {
      console.log(req.file.mimetype, 'path', req.file.filename);
      let dataBuffer = fs.readFileSync('./public/uploads/' + req.file.filename);
      console.log(req.body.contentID, 'contentID -----------------------');
      pdf(dataBuffer)
        .then(function (data) {
          var d = data['text'];
          var ContentText = convertDomToHtmlString(d);

          db.AddingText(
            req.body.contentID,
            ContentText,
            req.body.MediaOrder,

            (error, result) => {
              if (error) {
                res.status(500).send('لا يمكن تحويل ملف ال pdf').end();
              } else {
                return res.status(200).send({ path: req.file.filename }).end();
              }
            }
          );
          //---------------------------------------------  Convert the Text After Uploading  ------------------------------------------------------------------------//
        })
        .catch((error) => {
          res.status(500).send("Can't Convert the PDF .....").end();
        });
    }
  });
});

//---------------------------------------------------------------------------//
Articles.post('/Articles/UpdateArticle', (req, res) => {
  console.log('in the articals update');
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
  console.log(
    req.body.UpdateDate,
    req.body.ID,
    req.body.not,
    req.body.Title,
    req.body.UpdateDate,
    req.body.UpdateByUser,

    '--------------------------------------------------'
  );
  db.UpdateArticle(
    req.body.ID,
    req.body.Title,
    req.body.not,
    req.body.icon,
    req.body.UpdateDate,
    req.body.UpdateByUser,
    (eror, result) => {
      if (eror) {
        res.status(500).send('خطأ بمعالجة البيانات').end();
      } else res.status(200).send(result).end();
    }
  );
});
//------------------------------------------------------------------//
//------------------------ Add Articles ----------------------------//
//------------------------------------------------------------------//
Articles.post('/Articles/DeleteArticle', (req, res) => {
  console.log(req.body.ID, '---------------------------------');
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
  db.deleteArticle(req.body.ID, (err, result) => {
    if (err) {
      res.status(500).send('خطأ بمعالجة البانات').end();
    } else {
      res.status(200).send(result).end();
    }
  });
});
//------------------------------------------------------------------//
//------------------------ Add Articles ----------------------------//
//------------------------------------------------------------------//
Articles.post('/Articles/InsertArticles', (req, res) => {
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
  db.addArticle(req.body.data, (err, result) => {
    console.log(req.body.data);
    if (err) {
      res.status(500).send(err).end();
    } else {
      res.status(200).send(result).end();
    }
  });
});
//-------------------------------------------------------------------//
//------------- create new Content If not Exist ---------------------//
//-------------------------------------------------------------------//
Articles.post('/Articles/getContentID', (req, res) => {
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
  db.createContentID(req.body.ArticleID, (err, result) => {
    if (err) {
      console.log(err, 'error');
      res.status(500).send(err).end();
    } else {
      // console.log(result, 'result from server articles / getContentID');
      res.status(200).send(result).end();
    }
  });
});

//---------------------------------------------------------------------------------//
//-------------- Insert A new Text Content To the DataBase ------------------------//
//---------------------------------------------------------------------------------//

Articles.post('/Articles/InsertText', (req, res) => {
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
  db.AddingText(
    req.body.ContentID,
    req.body.ContentText,
    req.body.MediaOrder,
    (error, result) => {
      if (error) {
        res.status(500).send('فشل العمليه').end();
      } else {
        res.status(200).send(result).end();
      }
    }
  );
});

//-------------------------------------------------------------------------------------//
//-------------------- get all texts for a content ID ---------------------------------//
//-------------------------------------------------------------------------------------//
Articles.post('/Articles/gettText', (req, res) => {
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
  db.GetAllTextsForaContent(req.body.contentID, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send('خطأ في معالجة البيانات').end();
    } else {
      res.status(200).send(result).end();
    }
  });
});

//------------------------ DELET Text OR Text's Depending on thier ID'S ----------//
Articles.post('/Articles/DeletetTexts', (req, res) => {
  db.DeleteTextByID(req.body.TextIDs, (error, result) => {
    if (error) {
      res.status(500).send('خطأ في معالجة البيانات').end();
    } else {
      res.status(200).send(result).end();
    }
  });
});

//------------------------ Insert Media ---------------------------------------------//
Articles.post('/Articles/InsertMedia', (req, res) => {
  db.insertToMedia(
    req.body.ContentID,
    req.body.MediaLink,
    req.body.MediaOrder,
    req.body.MediaType,
    (error, result) => {
      if (error) {
        res.status(500).send(' خطأ في معالجة البيانات').end();
      } else {
        res.status(200).send(result).end();
      }
    }
  );
});

Articles.post('/Articles/DeleteMedia', (req, res) => {
  db.DeleteFromMedia(req.body.MediaID, (error, result) => {
    if (error) {
      res.status(500).send('خطأ في معالجة البيانات ').end();
    } else {
      res.status(200).send(result).end();
    }
  });
});
//---------------------- Get All Media -----------------------------//
Articles.post('/Articles/GetAllMedia', (req, res) => {
  db.getAllMedia(req.body.ContentID, (error, result) => {
    if (error) {
      res.status(500).send('خطأ في معالجة البيانات ').end();
    } else {
      res.status(200).send(result).end();
    }
  });
});

//---------------------------------- Get All Media ----------------------------------------//
Articles.post('/Articles/UpdateTex', (req, res) => {
  db.UpdateTexConten(req.body.TextID, req.body.ContentText, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send('خطأ في معالجة البيانات').end();
    } else {
      res.status(200).send(result).end();
    }
  });
});

//---------------------------------- ReOrder All Contents ----------------------------------------//
Articles.post('/Articles/ReOrder', (req, res) => {
  // console.log('data ', req.body.data);
  /// ---------------------------------loop throw our Object to Update Order-------------------------//
  // console.log(req.body.data.length, '11111111111111111111111111');

  // console.log(req.body.data[i]['data'], '11111111111111111111111111');
  //----------------------------------- if the Content is An Image ----------------------------------//
  db.ReorderContent(req.body.data, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).send(error).end();
    } else {
      console.log(result);
      res.status(200).send('تم ').end();
    }
  });
});
module.exports = Articles;

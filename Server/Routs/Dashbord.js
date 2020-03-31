//------------------------------------------------------//
//-------------include all necessary libraries ---------//
//------------------------------------------------------//
const express = require('express');
const Dashbord = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const dbModel = require('../../db/models');
const fs = require('fs');

//------------------------------------------------------//
//------------- use Wanted Libraries -------------------//
//------------------------------------------------------//
Dashbord.use(bodyParser.json());
Dashbord.use(bodyParser.urlencoded({ extended: true }));

Dashbord.get('/Dashbord/getAllModules', (req, res) => {
  //---------------------------read all imges in the directory ---------------------//

  //--------------------------------------------------------------------------------//
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

  // ---------------------------------------------------------//
  // ------ Connect To DataBase And Retrive all Modules-------//
  // ----------------------------------------------------------//
  dbModel.getAllModules((err, result) => {
    if (err) {
      res
        .status(400)
        .send('Error Retriving Data')
        .end();
    } else {
      res
        .status(200)
        .send(result)
        .end();
    }
  });

  //----------------------------------------------------------//
  //------------- Update A module by its ID -- ---------------//
  //----------------------------------------------------------//
});

Dashbord.post('/Dashbord/UpdateModule', (req, res) => {
  dbModel.UpdateModule(
    req.body.ID,
    req.body.Title,
    req.body.image,
    (error, result) => {
      if (error) {
        res
          .status(500)
          .send('Data Error ')
          .end();
      } else {
        res
          .status(200)
          .send(result)
          .end();
      }
    }
  );
});

//----------------------------------------------------------//
//------------- Delet A module by its ID -- ----------------//
//----------------------------------------------------------//
Dashbord.post('/Dashbord/DeleteModule', (req, res) => {
  dbModel.DeleteeModule(req.body.ID, (error, result) => {
    if (error) {
      res
        .status(500)
        .send('error in data')
        .end();
    } else {
      res
        .status(200)
        .send(result)
        .end();
    }
  });
});

//--------------------------------------------------------------------------//
//------------- get all Topic of this Module bi moduleID -- ----------------//
//--------------------------------------------------------------------------//
Dashbord.get('/Dashbord/getModuleTopics', (req, res) => {
  dbModel.getAllTopicOfModels(req.query.ID, (error, result) => {
    if (error) {
      res
        .status(500)
        .send('Server Error')
        .end();
    } else {
      res
        .status(200)
        .send(result)
        .end();
    }
  });
});

//--------------------------------------------------------------------------//
//------------- get all Topic of this Module bi moduleID -- ----------------//
//--------------------------------------------------------------------------//
Dashbord.post('/Dashbord/getTopic', (req, res) => {
  dbModel.getOneTopic(req.body.TopicID, req.body.ModuleID, (error, result) => {
    if (error) {
      res
        .status(500)
        .send('Server Error')
        .end();
    } else {
      res
        .status(200)
        .send(result)
        .end();
    }
  });
});

//--------------------------------------------------------------------------//
//------------- get all Topic of this Module bi moduleID -- ----------------//
//--------------------------------------------------------------------------//
Dashbord.post('/Dashbord/AddTopicsToMoules', (req, res) => {
  dbModel.addTopicToAmodel(
    req.body.ID,
    req.body.Title,
    req.body.Link,
    (error, result) => {
      if (error) {
        res
          .status(500)
          .send('Server Error')
          .end();
      } else {
        res
          .status(200)
          .send(result)
          .end();
      }
    }
  );
});

Dashbord.post('/Dashbord/ArticleOfTopic', (req, res) => {
  dbModel.getAllArticleOfTopic(req.body.ID, (error, result) => {
    if (error) {
      res
        .status(500)
        .send('Server Error')
        .end();
    } else {
      res
        .status(200)
        .send(result)
        .end();
    }
  });
});
//------------------------------------------ add Module to the List ------------------------//
Dashbord.post('/Dashbord/addModule', (req, res) => {
  dbModel.addModule(
    req.body.Title,
    req.body.Icon,
    req.body.CreatedBy,
    (error, result) => {
      if (error) {
        res
          .status(500)
          .send('error in insertin data')
          .end();
      } else {
        res
          .status(200)
          .send(result)
          .end();
      }
    }
  );
});
//-------------------------------Update a Topic Depending on its Id ------------------//
Dashbord.post('/Dashbord/UpdatTopic', (req, res) => {
  dbModel.UpdateTopic(
    req.body.TopicID,
    req.body.Title,
    req.body.Icon,
    (error, result) => {
      if (error) {
        res
          .status(500)
          .send('error in insertin data')
          .end();
      } else {
        res
          .status(200)
          .send(result)
          .end();
      }
    }
  );
});

//-------------------------------Delete a Topic Depending on its Id ------------------//
Dashbord.post('/Dashbord/DeleteTopic', (req, res) => {
  dbModel.deleteTopic(req.body.TopicID, (error, result) => {
    if (error) {
      res
        .status(500)
        .send('error in insertin data')
        .end();
    } else {
      res
        .status(200)
        .send(result)
        .end();
    }
  });
});

//-------------------------------Delete a Topic Depending on its Id ------------------//
Dashbord.post('/Dashbord/addTopicToAmodel', (req, res) => {
  dbModel.addTopicToAmodel(
    req.body.ModelID,

    req.body.Title,
    req.body.Icon,
    (error, result) => {
      if (error) {
        res
          .status(500)
          .send('error in insertin data')
          .end();
      } else {
        res
          .status(200)
          .send(result)
          .end();
      }
    }
  );
});

module.exports = Dashbord;

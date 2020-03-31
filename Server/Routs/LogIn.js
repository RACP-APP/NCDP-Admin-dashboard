//------------------------------------------------------//
//-------------include all necessary libraries ---------//
//------------------------------------------------------//
const express = require('express');
const User = express.Router();
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const dbModel = require('../../db/models');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const MailTo = require('../EmailAuth');

//------------------------------------------- google Email Creditentals ----------------------------------------------------//

//------------------------------------------------------//
//------------- use Wanted Libraries -------------------//
//------------------------------------------------------//
User.use(bodyParser.json());
User.use(bodyParser.urlencoded({ extended: true }));
User.use(cors());

//---------------------------------------------------------------------------------------------------------------------------//
//-------------------------------------------------Login route --------------------------------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------//
User.post('/User/Login', (req, res) => {
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

  //---------------------------------------------------------------------------------//
  //------ Connect To Database and get user by email and password -------------------//
  //---------------------------------------------------------------------------------//
  dbModel.GetUserByUserName(req.body.Email, async (error, result) => {
    if (error) {
      res
        .status(500)
        .send('Server Error')
        .end();
    } else {
      //----------------------------------------------------------------------------------------------------------------------//
      //--------------------- try to compar the password  entered by user and the password in the database -------------------//
      //----------------------------------------------------------------------------------------------------------------------//
      try {
        await bcryptjs.compare(
          req.body.password,
          result[0]['password'],
          (error, isMatch) => {
            //-----------------------------------------------------------------------------------------------------------------//
            //----------------------------- if the hashing compar operation failed return comparing error ---------------------//
            //-----------------------------------------------------------------------------------------------------------------//
            if (error) {
              res
                .status(500)
                .send('Server Error  ...')
                .end();
            } else {
              //---------------------------------------------------------------------------------------------------------------//
              //---------------------------- if comparing oeration complete successfuly ---------------------------------------//
              //---------------------------------------------------------------------------------------------------------------//
              if (isMatch) {
                //-------------------------------------------------------------------------------------------------------------//
                //-------------------------------------- if the password match then return our user Object --------------------//
                //-------------------------------------------------------------------------------------------------------------//

                usrer = [
                  {
                    userID: result[0]['userID'],
                    userName: result[0]['userName'],
                    Email: result[0]['Email'],
                    Image: result[0]['Image']
                  }
                ];
                console.log(usrer, 'rrrrrrrrrrrrrrrrrrr');
                res
                  .status(200)
                  .send(usrer)
                  .end();
              } else {
                //-------------------------------------------------------------------------------------------------------------//
                //------------------------------------ if password are not match then return not found ------------------------//
                //-------------------------------------------------------------------------------------------------------------//
                res
                  .status(500)
                  .send('No match Password')
                  .end();
              }
            }
          }
        );
      } catch {
        //----------------------------------------------------------------------------------------------------------------------//
        //------------------------------------------------ any Error while comparing the password ------------------------------//
        //----------------------------------------------------------------------------------------------------------------------//
        res
          .status(500)
          .send(' Failed to Find User ')
          .end();
      }
    }
  });

  //----------------------------------------------------//
  //------------- get user name by his ID ---------------//
  //-----------------------------------------------------//
});

User.post('/User/UserByID', (req, res) => {
  dbModel.getUserByID(req.body.userID, (error, result) => {
    if (error) {
      res
        .status(500)
        .send('Server Error ')
        .end();
    } else {
      res
        .status(200)
        .send(result)
        .end();
    }
  });
});
//------------------ get all users -------------------------//
User.post('/User/getAllUsers', (req, res) => {
  dbModel.getAllUsers((error, result) => {
    if (error) {
      console.log(error);
      res
        .status(500)
        .send('DataBase Error')
        .end();
    } else {
      res
        .status(200)
        .send(result)
        .end();
    }
  });
});
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------//
//---------------------------------------------------------------- Admin Update Operation -------------------------------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------//
User.post('/User/UpdateUser', async (req, res) => {
  // console.log(Subject, Html, Text);
  console.log('password', req.body.password);
  var d = req.body.password;
  //-----------------------------------------------------------------------------------------------------------------//
  //------------------------ hashing the password using bcrybt and then Update the user -----------------------------//
  //-----------------------------------------------------------------------------------------------------------------//
  try {
    await bcryptjs
      .hash(req.body.password, 10)
      .then(hashed => {
        //-----------------------------------------------------------------------------------------------------------//
        //----------------------------------- if we have a hash then upadte -----------------------------------------//
        //-----------------------------------------------------------------------------------------------------------//
        dbModel.updateUser(
          req.body.userName,
          req.body.Email,
          req.body.Image,
          hashed,
          req.body.userID,
          (error, result) => {
            if (error) {
              //-----------------------------------------------------------------------------------------------------//
              //--------------------------------- if Error with Sql the return sql error ----------------------------//
              //-----------------------------------------------------------------------------------------------------//
              res
                .status(500)
                .send(error)
                .end();
              return;
            } else {
              -(
                //-------------------------------------- sending Email to the User with Updatet Info--------------------------------------//
                MailTo.Mailling(
                  req.body.Email,
                  'Updating your account info',
                  `<p>HI ${req.body.userName},this Email from NCDP Dashboard .  Your Account hase been Updated and \n here is your New Account Information'</p>,
                <div><li> Email ${req.body.Email}</li>
                <li> username ${req.body.userName}</li>
               <p> Be Carfull with thos ifo </p> </div>`
                )
              );
              //-----------------------------------------------------------------------------------------------------//
              //----------------------------------- if user is saved return result ----------------------------------//
              //-----------------------------------------------------------------------------------------------------//
              res
                .status(200)
                .send(result)
                .end();
            }
          }
        );
      })
      .catch(error => {
        //-------------------------------------------------------------------------------------------------------------//
        //--------------------------------- if hashing Error return Hashing Error -------------------------------------//
        //-------------------------------------------------------------------------------------------------------------//
        res
          .status(500)
          .send(' Hashing  Error ')
          .end();
      });
  } catch {
    //-----------------------------------------------------------------------------------------------------------------//
    //-------------------------------- try accurede an Error then retun hashing error ---------------------------------//
    //-----------------------------------------------------------------------------------------------------------------//

    res
      .status(500)
      .send('hashin Error')
      .end();
  }
});

//-----------------------------------------------------------------------------------------------------------------------//
//------------------------------------------------ add User By The Admin ------------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------//
User.post('/User/AddUser', async (req, res) => {
  //---------------------------------------------------------------------------------------------------------------------//
  //-------------------------- hashing the password using bcrybt and then Update the user -------------------------------//
  //---------------------------------------------------------------------------------------------------------------------//
  try {
    //-------------------------------------------------------------------------------------------------------------------//
    //-------------------------------------- wait to hash the password --------------------------------------------------//
    //-------------------------------------------------------------------------------------------------------------------//
    await bcryptjs.hash(req.body.password, 10).then(hashed => {
      //-----------------------------------------------------------------------------------------------------------------//
      //------------------------------ after hashing the password we are ready to insert the User -----------------------//
      //-----------------------------------------------------------------------------------------------------------------//
      console.log('in the hashing ', hashed);
      //---------------------------- schek for UserNAME and Email Befor Inserting ----------------------------------------//

      dbModel.addUser(
        req.body.userName,
        req.body.Email,
        req.body.Image,
        hashed,
        (error, result) => {
          //-------------------------------------------------------------------------------------------------------------//
          //---------------------------------------- if insertion accured an Error --------------------------------------//
          //-------------------------------------------------------------------------------------------------------------//

          if (error) {
            console.log(error);
            res
              .status(500)
              .send(error)
              .end();
          } else {
            //------------------------------------------------------------------------------------------------------------//
            //----------------------------------- if we inserted the data Correctly --------------------------------------//
            //------------------------------------------------------------------------------------------------------------//
            MailTo.Mailling(
              req.body.Email,
              'Joining NCDP Dashboard ',
              `<p>HI ${req.body.userName},Welcom to  NCDP Dashboard . here is Your Account admin Info'</p>,
               <div><li> Email ${req.body.Email}</li>
               <li> username ${req.body.userName}</li>
               <li>New Password: ${req.body.password}</li> <p> Be Carfull with thos ifo.  </p> </div>`
            );
            res
              .status(200)
              .send(result)
              .end();
          }
        }
      );
    });
  } catch {
    //-----------------------------------------------------------------------------------------------------------------------//
    //---------------------------------------------------- if an error accured during hashing -------------------------------//
    //-----------------------------------------------------------------------------------------------------------------------//
    console.log('in the catch ', result);
    res
      .status(500)
      .send(' Hashing Error ')
      .end();
  }
});

//------------------------------------------------------ Delete a User -------------------------------------------------------//
User.post('/User/deleteUser', (req, res) => {
  //---------------------- sending data to the data model --------------------------------------------------------------------//
  dbModel.deleteUser(req.body.userID, req.body.userName, (error, result) => {
    if (error) {
      res
        .status(500)
        .send(error)
        .end();
    } else {
      res
        .status(200)
        .send(result)
        .send();
    }
  });
});

User.post('/User/ChangePassword', (req, res) => {
  dbModel.GetUserByUserName(req.body.Email, async (error, result) => {
    if (error) {
      console.log(error, 'from GetUserByUserName');
      // ---------------------- get the password stored in the database to compar it with the new One ---------//
      res
        .status(500)
        .send('Server Error')
        .end();
    } else {
      console.log(result[0]['password'], 'from GetUserByUserName');
      try {
        //------------------- try to compar passwords after getting the password from data base ---------------//
        bcryptjs.compare(
          req.body.password,
          result[0]['password'],
          (error, isMatch) => {
            if (error) {
              console.log(error, ' bcryptjs.compare');
              //----------------------------- if comparing retuns an error -------------------------------------//
              res
                .status(500)
                .send('Hasshing Error')
                .end();
            } else {
              //----------------------------------- if no errors but no match -----------------------------------//
              if (!isMatch) {
                console.log(isMatch, 'isMatch bcryptjs.compare');
                res
                  .status(500)
                  .send(
                    'Password Dose Not Match did you forget yor password ?!!'
                  )
                  .end();
              } else {
                console.log('in try ............... bcryptjs.hash');
                //----------------------------------------- try to Hash the password -------------------------------//
                try {
                  console.log(
                    req.body.Newpassword,
                    'in try ............... bcryptjs.hash'
                  );
                  bcryptjs
                    .hash(req.body.Newpassword, 10)
                    .then(Hashed => {
                      console.log(Hashed, 'Hashed bcryptjs.hash');
                      //------------------------------- if Password is Hahed Update the User ------------------------//
                      dbModel.updateUser(
                        req.body.userName,
                        req.body.Email,
                        req.body.Image,
                        Hashed,
                        req.body.userID,
                        (error, result) => {
                          //------------------------------- if error in Updating Tell the User------------------------//

                          if (error) {
                            res
                              .status(500)
                              .send(
                                'Something Went Rong While Updating Plaese Try Agin Later'
                              )
                              .end();
                          } else {
                            //----------------------- No Errors in Updating Operation ----------------------------------//
                            res
                              .status(200)
                              .send(result)
                              .end();
                          }
                        }
                      );
                    })
                    .catch(error => {
                      console.log(error, 'uuuuuuuuuuuuuuuuuu');
                      //--------------------------------- Hashing the password has an exption --------------------------//
                      res
                        .status(500)
                        .send('Hashing Error Please Try again Later .')
                        .end();
                    });
                } catch {
                  console.log('22222222222222222');
                  //------------------------------------- try to hash the passwor has an exption -------------------------//
                  res
                    .status(500)
                    .send('Hashing Error Please Try again Later .');
                }
              }
            }
          }
        );
      } catch {
        //---------------------------------- if comparing the passwords returns an Exeption -------------------------------//

        console.log('hiiiiiiiiiiiiiiiiiii');
        res.status(500).send('Hashing Error Please Try again Later .');
      }
    }
  });
});

module.exports = User;

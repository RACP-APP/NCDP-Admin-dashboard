var db = require('./db');
var async = require('async');

//------------------------------------------------------------------------------------//
//-------------------------------- A function to get all users -----------------------//
//------------------------------------------------------------------------------------//
var GetUsers = (cb) => {
  db.query('select * from `USERS`', (error, rsult, fields) => {
    if (error) {
      console.log('Query Error');
      cb(error);
    }
    console.log(rsult, 'result');
    cb(rsult);
  });
};

//---------------------------------------------------------------------------------------//
//--------- A function to get all one user depend in its password and username ----------//
//---------------------------------------------------------------------------------------//
var GetUserByUserName = (Email, cb) => {
  console.log('ggggggggggggggggggggggggggg', Email);
  db.query(
    'SELECT userID ,userName ,Email, password,Image  FROM `USERS` WHERE    Email="' +
      Email +
      '" ',
    (error, result, fields) => {
      if (error) {
        cb(error, null);
        console.log(error);
      } else {
        console.log(result);
        cb(null, result);
      }
    }
  );
};

//----------------------------------------------------------------------------------------//
//------------------------ a Function to get all Modules ---------------------------------//
//----------------------------------------------------------------------------------------//
var getAllModules = (cb) => {
  db.query(
    'SELECT  MODELS.* ,USERS.userName USERS FROM MODELS INNER JOIN USERS ON MODELS.CreatedBy =USERS.userID ',
    (error, result, fields) => {
      if (error) {
        console.log(error);

        cb(error, null);
      }
      // console.log(result);
      cb(null, result);
    }
  );
};

//----------------------------------------------------------------------------------------//
//------------------------ a Function to get a user By ID---------------------------------//
//----------------------------------------------------------------------------------------//
var getUserByID = (userID, cb) => {
  db.query(
    'SELECT  userName FROM   `USERS` where userID = "' + userID + '"',
    (error, result, fields) => {
      if (error) {
        console.log(error);

        cb(error, null);
      }
      // console.log(result);
      cb(null, result);
    }
  );
};

//--------------------------------------------------------------------------------------//
//---------------------------------- Add A new User ------------------------------------//
//--------------------------------------------------------------------------------------//
var addUser = (userName, Email, Image, password, cb) => {
  //----------------------------- Check if the User Name is not Admin and the Email dose not Exist ------------------------//
  db.query(
    'Select Email  from `USERS`  Where  Email= "' + Email + '"',
    (error, result, fields) => {
      if (error) {
        cb('connection Error', null);
        return;
      } else {
        if (result.length >= 1) {
          cb('Duplicate Emails', null);
          return;
        } else {
          if (userName.toUpperCase() === 'admin'.toUpperCase()) {
            cb('Just One Adim Is Allowed', null);
            return;
          } else {
            console.log(result);
            db.query(
              'INSERT INTO `USERS` (salt,userName, Email,Image, password) VALUES ("' +
                password +
                '" , "' +
                userName +
                '" , "' +
                Email +
                '" , "' +
                Image +
                '" , "' +
                password +
                '" )',
              (error, result, fields) => {
                if (error) {
                  cb('Duplicate User Name Or conntion Error', null);
                  return;
                } else {
                  cb(null, result);
                }
              }
            );
          }
        }
      }
    }
  );
};
//----------------------------------------------------------------------------------------//
//------------------------------ Delete a user from the List -----------------------------//
//----------------------------------------------------------------------------------------//
var deleteUser = (userID, userName, cb) => {
  //---------------chek first if the user name is not admin ------------------------------//
  if (userName.toUpperCase() === 'admin'.toUpperCase()) {
    cb('Cannot Delete Admin', null);
  } else {
    db.query(
      'DELETE FROM `USERS` WHERE userID IN (' + [...userID].toString() + ' )',
      (error, result, fields) => {
        if (error) {
          cb('Connection Error Please try agian later', null);
        } else {
          cb(null, result);
        }
      }
    );
  }
};

//----------------------------------------------------------------------------------------//
//------------------------ a fun to Update a model using its ID --------------------------//
//----------------------------------------------------------------------------------------//
var UpdateModule = (ModelID, Title, Icon, cb) => {
  console.log(ModelID, Title, Icon, 'model');
  db.query(
    'UPDATE  MODELS SET Title ="' +
      Title +
      '"  , Icon ="' +
      Icon +
      '" where ModelID = ' +
      ModelID,
    (error, result, fields) => {
      if (error) {
        console.log(error);

        cb(error, null);
      }
      cb(null, result);
    }
  );
};

//----------------------------------------------------------------------------------------//
//------------------------ a fun to Delete a model using its ID --------------------------//
//----------------------------------------------------------------------------------------//
var DeleteeModule = (ModelID, cb) => {
  db.query(
    'Delete from  MODELS  where ModelID = ' + ModelID,
    (error, result, fields) => {
      if (error) {
        console.log(error);

        cb(error, null);
      }
      cb(null, result);
    }
  );
};

//----------------------------------------------------------------------------------------//
//------------------- a fun to get all topics of a spasific module -----------------------//
//----------------------------------------------------------------------------------------//
getAllTopicOfModels = (ID, cb) => {
  db.query(
    'SELECT  * FROM   Topics where ModelID = "' + ID + '"',
    (error, result, fields) => {
      if (error) {
        console.log(error);
        cb(error, null);
      } else {
        cb(null, result);
      }
    }
  );
};

//----------------------------------------------------------------------------------------//
//------------------- a fun to get all Articales of a spasific Topic -----------------------//
//----------------------------------------------------------------------------------------//
getAllArticleOfTopic = (ID, cb) => {
  db.query(
    'SELECT  Article.*  , G.userName as createBy, G.userName as UpdatedBy from  Article  , `USERS` G Where  Article.UpdateByUser=G.userID  AND  Article.CreatedByUser=G.userID  and TopicID = "' +
      ID +
      '"',
    (error, result, fields) => {
      if (error) {
        console.log(error);
        cb(error, null);
      } else {
        cb(null, result);
        console.log(result);
      }
    }
  );
};

//----------------------------------------------------------------------------------------//
//------------------- a fun to get all topics of a spasific module -----------------------//
//----------------------------------------------------------------------------------------//
addTopicToAmodel = (ID, Title, link, cb) => {
  if (link !== '') {
    db.query(
      'INSERT INTO  Topics (ModelID ,Title,Icon ) VALUES ( "' +
        ID +
        '" ,"' +
        Title +
        '","' +
        link +
        '")',
      (error, result, fields) => {
        if (error) {
          console.log(error);
          cb(error, null);
        } else {
          cb(null, result);
        }
      }
    );
  } else {
    db.query(
      'INSERT INTO  Topics (ModelID ,Title ) VALUES ( ' +
        ID +
        ' ,"' +
        Title +
        '")',

      (error, result, fields) => {
        if (error) {
          console.log(error);
          cb(error, null);
        } else {
          cb(null, result);
        }
      }
    );
  }
};
//-------------------------------------------------------------------------//
//----------------Update An Article Depending on its TopicID --------------//
//-------------------------------------------------------------------------//
var UpdateArticle = (ID, Title, notes, icon, UpdateDate, UpdateByUser, cb) => {
  console.log(UpdateDate);
  if (Title !== '' && notes !== '') {
    console.log('have both  title and botes');
    db.query(
      'UPDATE  Article SET Title ="' +
        Title +
        '" ,Notes ="' +
        notes +
        '" ,Icon ="' +
        icon +
        '" ,UpdateDate ="' +
        UpdateDate +
        '" ,UpdateByUser ="' +
        UpdateByUser +
        '" where ArticleID = ' +
        ID,
      (error, result, fields) => {
        if (error) {
          console.log(error);

          cb(error, null);
        }
        cb(null, result);
      }
    );
  } else {
    if (Title === '' && notes !== '') {
      console.log('have both  title ', notes, 'notes');
      db.query(
        'UPDATE  Article SET Notes ="' +
          notes +
          '" ,Icon ="' +
          icon +
          '" ,UpdateDate ="' +
          UpdateDate +
          '" ,UpdateByUser ="' +
          UpdateByUser +
          '" where ArticleID = ' +
          ID,
        (error, result, fields) => {
          if (error) {
            console.log(error);

            cb(error, null);
          }
          cb(null, result);
        }
      );
    } else if (notes === '' && Title !== '') {
      console.log('have both  notes ');
      db.query(
        'UPDATE  Article SET  Title ="' +
          Title +
          '" ,Icon ="' +
          icon +
          '" ,UpdateDate ="' +
          UpdateDate +
          '" ,UpdateByUser ="' +
          UpdateByUser +
          '" where ArticleID = ' +
          ID,
        (error, result, fields) => {
          if (error) {
            console.log(error);

            cb(error, null);
          }
          cb(null, result);
        }
      );
    } else {
      console.log('have not title no notes ');

      db.query(
        'UPDATE  Article SET  Icon ="' + icon + '" where ArticleID = ' + ID,
        (error, result, fields) => {
          if (error) {
            console.log(error);

            cb(error, null);
          }
          cb(null, result);
        }
      );
    }
  }
};
//-----------------------------------------------------------------------//
//----------------------- Delete an Article -----------------------------//
//-----------------------------------------------------------------------//
var deleteArticle = (ID, cb) => {
  db.query(
    'DELETE FROM Article WHERE ArticleID = ' + ID,
    (error, result, fields) => {
      console.log(error);
      if (error) {
        cb(error, null);
      } else {
        cb(null, result);
      }
    }
  );
};

//-----------------------------------------------------------------------//
//----------------------- Add an Article -----------------------------//
//-----------------------------------------------------------------------//
var addArticle = (data, cb) => {
  //--------------------------------------------------------------//
  //------- create the insert statment depnding on arguments -----//
  //--------------------------------------------------------------//
  let inserStatment = 'INSERT INTO Article (  ( ';
  let fields = '';
  let values = '';
  for (var key in data) {
    fields += key + ' ,';
    if (typeof data[key] === 'number') {
      values += data[key] + ',';
    } else {
      values += ' "' + data[key] + '" ,';
    }
  }
  values = values.substring(0, values.length - 1);
  fields = fields.substring(0, fields.length - 1);
  inserStatment +=
    fields.substring(0, fields.length - 1) +
    ') VALUES (' +
    values.substring(0, values.length - 1) +
    ')';

  if (data['Notes'] === '') {
  }
  db.query(
    'INSERT INTO Article ( TopicID, Icon ,Title,UpdateDate ,UpdateByUser,CreatedByUser,CreatedDate,TimesViewd ,Notes)  VALUES ( ' +
      data['TopicID'] +
      " ,'" +
      data['Icon'] +
      "' , '" +
      data['Title'] +
      "' ,'" +
      data['CreatedDate'] +
      "' ," +
      data['CreatedByUser'] +
      ', ' +
      data['CreatedByUser'] +
      ' ,"' +
      data['CreatedDate'] +
      '" ,' +
      0 +
      " ,'" +
      data['Notes'] +
      "'" +
      '  )',
    (error, result, fields) => {
      console.log(error);
      if (error) {
        cb(error, null);
      } else {
        cb(null, result);
      }
    }
  );
};

//--------------------------------------------------------------------------------//
//----------------------- Add an Module ------------------------------------------//
//--------------------------------------------------------------------------------//
var addModule = (Title, Icon, CreatedBy, cb) => {
  console.log(Title, Icon, CreatedBy, 'from db');
  //------------------- Try to Insert the values of the Modules ----------------//
  db.query(
    'INSERT INTO MODELS  (  Title ,Icon ,CreatedBy ) VALUES  ( "' +
      Title +
      '","' +
      Icon +
      '",' +
      CreatedBy +
      '  ) ',
    (error, result, fields) => {
      if (error) {
        cb(error, null);
      } else {
        console.log(result);
        //-------------------- get the module ID that is recently addede -------------//
        db.query('SELECT MAX(ModelID) FROM MODELS', (error, result, fields) => {
          if (error) {
            cb(error, null);
          } else {
            //--------------------- inset a new Tpic to this module ------------------//
            var ModuleID = result[0]['MAX(ModelID)'];
            db.query(
              'INSERT INTO Topics  (  ModelID ,Icon ,Title ) VALUES  ( ' +
                ModuleID +
                ",'" +
                ' https://cdn.onlinewebfonts.com/svg/img_370232.png' +
                "','" +
                Date.now() +
                '-New Topic - ' +
                ModuleID +
                "')",
              (error, result) => {
                if (error) {
                  //-------- if the imsertion of the Topic didnt go will the we delete the module ----------//
                  db.query(
                    'DELETE FROM MODELS WHERE ModelID =  ' + ModelID,
                    (error, result, fields) => {
                      if (error) {
                        cb(error, null);
                      } else {
                        cb(null, result);
                      }
                    }
                  );
                } else {
                  //------------------------------ return the module id to the response ------------------//
                  cb(null, { ModuleID: ModuleID });
                }
              }
            );
          }
        });
      }
    }
  );
};

var UpdateTopic = (TopicId, Title, Icon, cb) => {
  if (Icon !== '' || Icon !== undefined) {
    console.log(TopicId, 'TopicId', Title, 'Title', Icon, 'Icon');
    db.query(
      ' UPDATE  Topics SET  Title = "' +
        Title +
        '", Icon="' +
        Icon +
        ' " WHERE TopicID =' +
        TopicId,
      (error, result, fields) => {
        if (error) {
          cb(error, null);
        } else {
          cb(null, result);
        }
      }
    );
  } else {
    db.query(
      ' UPDATE  Topics SET  Title = "' + Title + ' " WHERE TopicID =' + TopicId,
      (error, result, fields) => {
        if (error) {
          cb(error, null);
        } else {
          cb(null, result);
        }
      }
    );
  }
};
//------------------------------------------Delete One Topic ----------------------//
var deleteTopic = (TopicID, cb) => {
  db.query(
    'DELETE FROM Topics WHERE TopicID = ' + TopicID,
    (error, result, fields) => {
      if (error) {
        cb(error, null);
      } else {
        cb(null, result);
      }
    }
  );
};
//------------------------------ Get Just One Topic -----------------------//
var getOneTopic = (TpicID, ModuleID, cb) => {
  db.query(
    'SELECT * FROM Topics where TopicID =' +
      TpicID +
      ' AND ' +
      ' ModelID =' +
      ModuleID,
    (error, result, fields) => {
      if (error) {
        console.log(error);
        cb(error, null);
      } else {
        cb(null, result);
      }
    }
  );
};
//------------------------------------------------------------------------------------------------------------------//
//------------------------------------- insert A content to Article if not Exist -----------------------------------//
//------------------------------------------------------------------------------------------------------------------//
var createContentID = (ArticleID, cb) => {
  //--------------------------------------if this article has a content --------------------------------------------//

  var allContent = {};
  var ContentID = 0;
  allContent['ArticleID'] = ArticleID;

  //--------------------------------select the content id if exist --------------------------------------------------//
  db.query(
    'SELECT contentID from  Content where ArticleID= ' + ArticleID,
    (error, result, fields) => {
      if (error) {
        console.log(error, 'error');
        cb(error, null);
      } else {
        //--------------------------------------------------------------------------------------------------------------------//
        //------------------------ if ther is no content for this article then insert a new one and then----------------------//
        //-----------------------------select it to have the id and empty array for text and media ---------------------------//
        //--------------------------------------------------------------------------------------------------------------------//
        if (result.length === 0) {
          // ContentID = result[0]['contentID'];

          db.query(
            ' INSERT INTO Content (ArticleID) VALUES  (' + ArticleID + ')',
            (error, result, fields) => {
              if (error) {
                console.log(error, 'error');
                cb(error, null);
              } else {
                //--------------------------- RE- SELECT THE CONTENT ID TO RETURN IT BACK TO OUR FORM ----------------------//
                db.query(
                  'SELECT  contentID from  Content where ArticleID= ' +
                    ArticleID,
                  (error, result, fields) => {
                    if (error) {
                      console.log(error, 'error');
                      cb(error, null);
                    } else {
                      //----------------- if ther is a new content return embty arrays with the content is ------------------//
                      allContent['contentID'] = result[0]['contentID'];
                      allContent['Text'] = [];
                      allContent['Media'] = [];
                      cb(null, allContent);
                    }
                  }
                );
              }
            }
          );
        } else {
          //------------------- if there's a result and the id exist the get text and media --------------//
          console.log(
            'eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
            result[0]['contentID']
          );

          contentID = allContent['contentID'] = result[0]['contentID'];
          db.query(
            'SELECT * FROM  `TEXT` WHERE  ContentID=' + result[0]['contentID'],
            (error, result, fields) => {
              if (error) {
                cb(error, null);
              } else {
                allContent['Text'] = result;
                getMedia();
              }
            }
          );
          //------------------- if there's a result and the id exist the get Media and media --------------//
          function getMedia() {
            db.query(
              'SELECT * from Media  WHERE  ContentID=' + result[0]['contentID'],
              (error, result, fields) => {
                if (error) {
                  cb(error, null);
                } else {
                  allContent['Media'] = result;
                  cb(null, allContent);
                }
              }
            );
          }
        }
      }
    }
  );
};

//------------------------------------ Add TEXT Content --------------------------------------------//
var AddingText = (contentID, ContentText, MediaOrder, cb) => {
  var max = 0;
  console.log(contentID, MediaOrder, 'from model');

  //-------------------- elect the max from the tow tables so we can get the max -------------------//
  db.query(
    ' SELECT MAX(MediaOrder)  from Media Where ContentID=' +
      contentID +
      '  UNION  SELECT MAX(MediaOrder)   from `TEXT` Where ContentID=' +
      contentID,
    (error, result) => {
      if (error) {
        console.log(error, 'jkhl;h.; oih;oi;pjkj;');
      } else {
        //---------------- if result is contain on row check if its nul or has a value ---------------------//
        console.log(result, 'result');
        if (result.length == 1) {
          //------------------------------------------------------------------------------------------------//
          if (result[0]['MAX(MediaOrder)'] !== null) {
            console.log(result, 'form tow result');
            max = result[0]['MAX(MediaOrder)'] || 1;
          } else {
            max = 1;
          } //------------------ else if the result hase tow values then check wich is greayer --------------//
        } else if (result.length == 2) {
          console.log(result, 'form tow result');
          max = result[0]['MAX(MediaOrder)'] + 1 || 1;
          if (result[0]['MAX(MediaOrder)'] < result[1]['MAX(MediaOrder)']) {
            max = result[1]['MAX(MediaOrder)'] + 1;
          }
        }

        //----------------Select the max Order form the tow tables to insert the Current Order -------------//
        //-----------------------------------Her we Insert The Wholw Data -----------------------------//
        db.query(
          ' INSERT INTO `TEXT` (ContentID, ContentText,MediaOrder,MediaType) VALUES (' +
            contentID +
            ',"' +
            ContentText +
            '",' +
            max +
            ',"Text" )',
          (error, result, fields) => {
            if (error) {
              console.log(error);
              cb(error, null);
            } else {
              cb(null, error);
            }
          }
        );

        /////////////////////////////////////////////////////////////////////////
      }
    }
  );
};
//------------------------------------ Get  a Text content by content ID ----------------------//
var GetAllTextsForaContent = (ContentID, cb) => {
  db.query(
    'SELECT * FROM `TEXT` WHERE ContentID =' + ContentID,
    (error, result, fields) => {
      if (error) {
        cb(error, null);
      } else {
        cb(null, result);
      }
    }
  );
};
//------------------------------ Delete a TextContent by its ID ------------------------------------//
var DeleteTextByID = (TextIDs, cb) => {
  var range = '';
  for (var i = 0; i < TextIDs.length; i++) {
    if (i === TextIDs.length - 1) {
      range += TextIDs[i];
    } else {
      range += TextIDs[i] + ' , ';
    }
  }

  console.log(range, 'this the range ------------------');
  db.query(
    'DELETE FROM `TEXT` where TextID IN (' + range + ')',
    (error, result, fields) => {
      if (error) {
        cb(error, null);
      } else {
        cb(null, result);
      }
    }
  );
};

//-------------------- insert rhe media data to the dataBase -------------------------//
var insertToMedia = (ContentID, MediaLink, MediaOrder, MediaType, cb) => {
  //-------------------- elect the max from the tow tables so we can get the max -------------------//
  var max = 0;
  db.query(
    ' SELECT MAX(MediaOrder)  from Media Where ContentID=' +
      ContentID +
      '  UNION  SELECT MAX(MediaOrder)   from `TEXT` Where ContentID=' +
      ContentID,
    (error, result) => {
      if (error) {
        console.log(error, 'jkhl;h.; oih;oi;pjkj;');
      } else {
        //---------------- if result is contain on row check if its nul or has a value ---------------------//
        console.log(result, 'result');
        if (result.length == 1) {
          //------------------------------------------------------------------------------------------------//
          if (result[0]['MAX(MediaOrder)'] !== null) {
            console.log(result, 'form tow result');
            max = result[0]['MAX(MediaOrder)'] || 1;
          } else {
            max = 1;
          } //------------------ else if the result hase tow values then check wich is greayer --------------//
        } else if (result.length == 2) {
          console.log(result, 'form tow result');
          max = result[0]['MAX(MediaOrder)'] + 1 || 1;
          if (result[0]['MAX(MediaOrder)'] < result[1]['MAX(MediaOrder)']) {
            max = result[1]['MAX(MediaOrder)'] + 1;
          }
        }

        //------------------------
        db.query(
          ' INSERT INTO Media (ContentID, MediaLink ,MediaOrder ,MediaType) VALUES (' +
            ContentID +
            " , '" +
            MediaLink +
            " ', " +
            max +
            " ,'" +
            MediaType +
            "')",
          (error, result) => {
            if (error) {
              cb(error, null);
            } else {
              cb(null, result);
            }
          }
        );
      }
    }
  );
};

//-------------------- insert The media data to the dataBase -------------------------//
var DeleteFromMedia = (MediaID, cb) => {
  db.query(' DELETE FROM Media where MediaID = ' + MediaID, (error, result) => {
    if (error) {
      cb(error, null);
    } else {
      cb(null, result);
    }
  });
};

//-------------------- Get All Media from the dataBase -------------------------//
var getAllMedia = (ContentID, cb) => {
  db.query(
    ' SELECT * FROM Media where ContentID = ' + ContentID,
    (error, result) => {
      if (error) {
        cb(error, null);
      } else {
        cb(null, result);
      }
    }
  );
};
var UpdateTexConten = (TextID, ContentText, cb) => {
  db.query(
    'UPDATE `TEXT` SET ContentText ="' +
      ContentText +
      '" WHERE TextID=' +
      TextID,
    (error, result) => {
      if (error) {
        cb(error, null);
      } else {
        cb(null, result);
      }
    }
  );
};

var getAllUsers = (cb) => {
  db.query(
    'Select * from `USERS` Where userName != "admin"',
    (error, result) => {
      if (error) {
        cb(error, null);
      } else {
        cb(null, result);
      }
    }
  );
};

//-------------------------------------------------- Update Order -------------------------------------------------//
var ReorderContent = (data, cb) => {
  let count = 0;
  async
    .forEachOf(data, (element, i, callback) => {
      if (element['data']['MediaType'] === 'Text') {
        console.log('ddd-', i);
        db.query(
          ' UPDATE Text SET MediaOrder=' +
            (i + 1) +
            ' WHERE  TextID=' +
            element['data']['TextID'],
          (error, result) => {
            if (error) {
              callback(error);
              return;
            } else {
              // ++count;
              callback();
            }
          }
        );
      } else {
        console.log('ttt-', i);
        db.query(
          'UPDATE Media SET MediaOrder =' +
            (i + 1) +
            ' WHERE  MediaID=' +
            element['data']['MediaID'],
          (error, result) => {
            if (error) {
              callback(error);
              return;
            } else {
              callback();
            }
          }
        );
      }
    })
    .then(() => {
      cb(null, 'done');
    })
    .catch((error) => {
      cb(error, null);
    });
};

var updateUser = (userName, Email, Image, password, userID, cb) => {
  db.query(
    'Select Email,userName,userID from `USERS` Where  Email= "' + Email + '"',
    (error, result, fields) => {
      if (error) {
        console.log(result, Email, 'model');
      } else {
        // --------------------- if ther is mor than one email send error ----------------//
        if (result.length > 1) {
          console.log('in dublicat .........', result);
          cb('Duplicat Emails', null);
        } else {
          //------------------------ if we have on row and it's not for this user then its a duplicate email --------------//
          if (result.length === 1 && result[0]['userID'] !== userID) {
            console.log(result, userID);
            console.log('not in dublicat .........', result);
            cb('dublicap Email Accounts', null);
          } else {
            console.log('not in dublicat .........', result);
            //---------------------- if no Email like this Email ----------------------------//
            console.log(userID, 'userID');
            db.query(
              ' UPDATE `USERS` SET  userName="' +
                userName +
                '" , Email="' +
                Email +
                '" , Image="' +
                Image +
                '" , password= "' +
                password +
                '"  WHERE   userID =' +
                userID,
              (error, result) => {
                if (error) {
                  cb(error, null);
                } else {
                  cb(null, result);
                }
              }
            );
          }
        }
      }
    }
  );
};

//------------------------------- Insert The Token Of  A new Rigistered Mobile for the Application ----------------------//
var AddNewToken = (Token, MobID, cb) => {
  db.query(
    ' INSERT INTO MobRegistration (MobID, Token ) VALUES ("' +
      MobID +
      '","' +
      Token +
      '")',
    (error, result, fields) => {
      if (error) {
        cb(error, null);
      } else {
        cb(null, result);
      }
    }
  );
};

// var ChangePassword=(userName, Email, Image, password, userID, cb) => {
//   db.query
// }
module.exports = {
  AddNewToken: AddNewToken,
  ReorderContent: ReorderContent,
  addUser: addUser,
  updateUser: updateUser,
  getAllUsers: getAllUsers,
  deleteUser: deleteUser,
  UpdateTexConten: UpdateTexConten,
  getAllMedia: getAllMedia,
  DeleteFromMedia: DeleteFromMedia,
  insertToMedia: insertToMedia,
  DeleteTextByID: DeleteTextByID,
  GetAllTextsForaContent: GetAllTextsForaContent,
  AddingText: AddingText,
  createContentID: createContentID,
  getOneTopic: getOneTopic,
  UpdateTopic: UpdateTopic,
  deleteTopic: deleteTopic,
  GetUserByUserName: GetUserByUserName,
  GetUsers: GetUsers,
  getAllModules: getAllModules,
  getUserByID: getUserByID,
  UpdateModule: UpdateModule,
  DeleteeModule: DeleteeModule,
  getAllTopicOfModels: getAllTopicOfModels,
  addTopicToAmodel: addTopicToAmodel,
  getAllArticleOfTopic: getAllArticleOfTopic,
  UpdateArticle: UpdateArticle,
  deleteArticle: deleteArticle,
  addArticle: addArticle,
  addModule: addModule,
};

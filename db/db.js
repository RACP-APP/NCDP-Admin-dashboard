//------------------------------------------------------//
//-------------include all necessary libraries ---------//
//------------------------------------------------------//
var mysql = require('mysql');

//------------------------------------------------------//
//-------------Connect to Ouer Database ----------------//
//------------------------------------------------------//
// var connection = mysql.createConnection({
//   host: '162.247.76.211',
//   port: '3306',
//   // password: '^{duZzswf!.d',
//   database: 'h1622477_NCDP'
// });
var connection = mysql.createConnection({
  user: 'root',
  password: '1111',
  database: 'ncdp'
});

connection.connect(error => {
  if (error) {
    console.log(error);
  } else {
    console.log('DataBase Is Connected');
  }
});

// ------------------- used to create models in the dataBase --------------------------------//
// connection.query(
//   'INSERT INTO MODELS ( Title, CreatedBy ,Icon ) VALUES (" Module8" ,' +
//     1 +
//     ' ,"https://icons.iconarchive.com/icons/aha-soft/free-3d-printer/256/Model-icon.png")',
//   (error, result, fields) => {
//     if (error) {
//       console.log(error);
//     }
//     console.log(result);
//   }
// );

// ------------------- used to create models in the dataBase --------------------------------//
// connection.query(
//   'INSERT INTO Topics ( Title, CreatedBy ,Icon ) VALUES (" Module8" ,' +
//     1 +
//     ' ,"https://icons.iconarchive.com/icons/aha-soft/free-3d-printer/256/Model-icon.png")',
//   (error, result, fields) => {
//     if (error) {
//       console.log(error);
//     }
//     console.log(result);
//   }
// );

// connection.query(
//   'INSERT INTO Article ( TopicID, Icon ,Title,UpdateDate ,UpdateByUser,CreatedByUser,CreatedDate,TimesViewd,Notes)  VALUES (7 ,"https://icons.iconarchive.com/icons/aha-soft/free-3d-printer/256/Model-icon.png","Article3581","9956-12-31",1,1,"9956-12-31",0,"ddddddddddddddd" )',
//   (error, result, fields) => {
//     if (error) {
//       console.log(error);
//     }
//     console.log(result);
//   }
// );

// connection.query(
//   'INSERT INTO Content ( ArticleID)  VALUES (7 )',
//   (error, result, fields) => {
//     if (error) {
//       console.log(error);
//     }
//     console.log(result);
//   }
// );

// connection.query(
//   'INSERT INTO Media ( ContentID ,MediaLink,MediaOrder,MediaType)  VALUES (5, "https://www.youtube.com/watch?v=wsGmJs9aQO8",3,"vedio" )',
//   (error, result, fields) => {
//     if (error) {
//       console.log(error);
//     }
//     console.log(result);
//   }
// );

// connection.query(
//   'INSERT INTO Text ( ContentID ,ContentText,MediaOrder,MediaType)  VALUES (5, "https://www.youtube.com/watch?v=wsGmJs9aQO8",1,"text" )',
//   (error, result, fields) => {
//     if (error) {
//       console.log(error);
//     }
//     console.log(result);
//   }
// );

module.exports = connection;

const db = require('./db');
const async = require('async');

function callback(error) {
  if (error) {
    console.log(error);
  }
}
function getData(callback) {
  var object = [];
  console.log('result');

  db.query(
    'SELECT MODELS.* ,users.userName from  MODELS , `USERS` users Where CreatedBy = users.userID',
    (error, result) => {
      if (error) {
        console.log(error, 'result');
      } else {
        // result = result;

        async
          .forEachOf(result, (element, i, callback) => {
            //------------------------------ data formating --------------------------//
            var d = JSON.stringify(element);
            object.push(JSON.parse(d));
            // console.log(element['ModelID']);
            db.query(
              'SELECT Topics.* from  Topics  Where Topics.ModelID = ' +
                element['ModelID'],
              (error, result) => {
                if (error) {
                  callback(error);
                } else {
                  if (result.length === 0) {
                    callback();
                  } else {
                    var topics = [];
                    for (var t = 0; t < result.length; t++) {
                      var d = JSON.stringify(result[t]);
                      topics.push(JSON.parse(d));
                    }
                    // console.log(result);
                    object[i]['Topics'] = topics;
                  }
                  console.log(i);
                  if (i === object.length - 1) {
                    console.log('ddddddddddddddddddd');
                    callback();
                  }
                }
              }
            );

            // console.log(object);
            // console.log(result.length, i);
          })
          .then(() => {
            console.log('22222222222222222222222');
            console.log(object);
            // callback();
          })
          .catch((error) => {
            callback(error);
          });

        //---------------- get all topic ---------------------------//
      }
    }
  );
}

getData(callback);

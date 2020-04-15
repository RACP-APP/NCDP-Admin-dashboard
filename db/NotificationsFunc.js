const fs = require('fs');
const path = require('path');
var file = path.join(__dirname, 'NewNotifications.json');
// var Model = {
//   ModelID: 109,
//   Title: '44',
//   Icon:
//     'https://firebasestorage.googleapis.com/v0/b/ncdp-270519.appspot.com/o/cordova_bot.png?alt=media&token=694cfb78-4dfa-4a96-a9ef-750e5c77cf71',
//   CreatedBy: 1,
//   userName: 'nono',
//   Topics: [],
// };

// var Topic = {
//   TopicID: 54,
//   ModelID: 109,
//   Icon: ' https://cdn.onlinewebfonts.com/svg/img_370232.png',
//   Title: 'Updated 1584094716665-New Topic - 109',
// };

//------------------------------------------------------------------------------------------------------------//
//----------------------------- a function to write all data to json file ------------------------------------//
//-----------------------------------------------------------------------------------------------------------//
var writToFile = (newData) => {
  var newData = [];
  fs.writeFile(file, JSON.stringify(newData), (error) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Done');
    }
  });
};
//------------------------------------------------------------------------------------------------------------//
//---------------------------------------- a function to add a topicto json file -----------------------------//
//------------------------------------------------------------------------------------------------------------//
//--------------- need the update

var WriteModel = (Model) => {
  fs.readFile(file, 'utf8', (error, data) => {
    if (error) {
      console.log(error, 'error');
    } else {
      console.log(JSON.parse(data), 'data');
      newData = [...JSON.parse(data)];
      newData.push(Model);
      writToFile(newData);
    }
  });
};
//-----------------------------------------------------------------------------------------------------------------//
//---------------------- Re-Write JSON file and insert a topic to an Existing Model -------------------------------//
//-----------------------------------------------------------------------------------------------------------------//

var writeTopic = (Topic) => {
  var newData = [];
  //--------------------------------------- read the json file ------------------------------------------------------//
  fs.readFile(file, 'utf8', (error, data) => {
    if (error) {
      console.log(error);
    } else {
      //------------------------------------------------- if no error -----------------------------------------------//
      //   console.log(data);
      //------------------------------------- extract array objects insde a new array -------------------------------//
      newData = [...JSON.parse(data)];
      //----------------------------------------------- loop throw models -------------------------------------------//
      for (var i = 0; i < newData.length; i++) {
        if (newData[i]['ModelID'] === Topic['ModelID']) {
          //---------------------------- check if the object has the prparity topics --------------------------------//
          if (!newData[i].hasOwnProperty('Topics')) {
            //--------------- if there is no array Tpics inside object creat one and asign value to it --------------//
            newData[i]['Topics'] = [Topic];
            break;
          } else {
            for (var j = 0; j < newData[i]['Topics'].length; j++) {
              //-------------- if the array exist check if there is a Topic with the same id and then update it ------------------//
              if (newData[i]['Topics'][j]['ModelID'] === Topic['ModelID']) {
                newData[i]['Topics'][j] = Topic;
                break;
              } else {
                // ------------------------ if there is no item with this id then add it to the array -----------------------------//
                newData[i]['Topics'].push(Topic);
                break;
              }
            }
          }
        }
      }
      writToFile(newData);
    }
  });
};

var addArticle = (addArticle) => {};
// WriteModel(Model);
// writeTopic(Topic);

module.exports = {
  WriteModel,
  writeTopic,
};

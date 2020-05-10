// import { promises as fs } from 'fs';
const db = require('./db');
const fs = require('fs');
const path = require('path');
var modules = [];
var cc = false;

var appDownload = {};
// var TimeReviwed = [];

//-------------------------- Creat an inital value to all Months of the Year --------------------------------//
var jan = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week4: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var Feb = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week4: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var Mar = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week4: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var aprile = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week4: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var may = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week4: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var jun = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week4: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var jul = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week4: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var ogst = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week4: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var sept = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week4: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var oct = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week4: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var nov = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week4: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var dec = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week4: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};

//-----------------------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------- a helper function to arrang the days of each week in a month ----------------------------------------------//
//-----------------------------------------------------------------------------------------------------------------------------------------------//
function arrangDays(month, day) {
  //-------------------------------------------------------------------------------//
  //------------------------------------- Week One --------------------------------//
  //-------------------------------------------------------------------------------//
  if (day >= 1 && day <= 7) {
    //-------------------- cheks if jan contains a prorities----------------------//
    if (month.hasOwnProperty('Week1')) {
      month.Week1.tatal += 1;
      //------------------------- week 1 and have a value for thisday then add 1
      if (month.Week1.days[day - 1] !== undefined) {
        month.Week1.days[day - 1] += 1;
      } else {
        //------------------------- week 1 and dose not have this a value for thisday then =1
        month.Week1.days[day - 1] = 1;
      }
    } else {
      //------------------------ create if not exist ------------------------------//
      month.Week1 = { tatal: 1 };
      month.Week1.days = new Array(7).fill(0);
      month.Week1.days[day - 1] = 1;
    }
  }
  //-------------------------------------------------------------------------------//
  //------------------------------------- Week tow --------------------------------//
  //-------------------------------------------------------------------------------//
  if (day > 7 && day <= 14) {
    //-------------------- cheks if jan contains a prorities----------------------//
    if (month.hasOwnProperty('Week2')) {
      month.Week2.tatal += 1;
      //------------------------- week 2 and have a value for thisday then add 1
      if (month.Week2.days[day - 1] !== undefined) {
        month.Week2.days[day - 1] += 1;
      } else {
        //------------------------- week 2 and dose not have this a value for thisday then =1
        month.Week2.days[day - 1] = 1;
      }
    } else {
      //------------------------ create if not exist ---------------------------------//
      month.Week2 = { tatal: 1 };
      month.Week2.days = new Array(7).fill(0);
      month.Week2.days[day - 1] = 1;
    }
  }

  //---------------------------------------------------------------------------------//
  //------------------------------------- Week three --------------------------------//
  //---------------------------------------------------------------------------------//
  if (day > 14 && day <= 22) {
    //-------------------- cheks if jan contains a prorities-------------------------//
    if (month.hasOwnProperty('Week3')) {
      month.Week2.tatal += 1;
      //------------------------- week 3 and have a value for thisday then add 1
      if (month.Week3.days[day - 1] !== undefined) {
        month.Week3.days[day - 1] += 1;
      } else {
        //------------------------- week 3 and dose not have this a value for thisday then =1
        month.Week3.days[day - 1] = 1;
      }
    } else {
      //------------------------ create if not exist --------------------------------//
      month.Week3 = { tatal: 1 };
      month.Week3.days = new Array(8).fill(0);
      month.Week3.days[day - 1] = 1;
    }
  }

  //---------------------------------------------------------------------------------//
  //------------------------------------- Week three --------------------------------//
  //---------------------------------------------------------------------------------//
  if (day > 22 && day <= 31) {
    //-------------------- cheks if jan contains a prorities-------------------------//
    if (month.hasOwnProperty('Week4')) {
      month.Week2.tatal += 1;
      //------------------------- week 4 and have a value for thisday then add 1
      if (month.Week4.days[day - 1] !== undefined) {
        month.Week4.days[day - 1] += 1;
      } else {
        //------------------------- week 4 and dose not have this a value for thisday then =1
        month.Week4.days[day - 1] = 1;
      }
    } else {
      //------------------------ create if not exist --------------------------------//
      month.Week4 = { tatal: 1 };
      month.Week4.days = new Array(9).fill(0);
      month.Week4.days[day - 1] = 1;
    }
  }
}

// -------------------------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------- afunction to create a ne object contains the number of downloads for each month and week ---------------------//
//--------------------------------------------------------------------------------------------------------------------------------------------------//
function getRegisteration(year, cb) {
  //   console.log(year);
  db.query(
    'SELECT * FROM MobRegistration WHERE YEAR(registrationDate)=' +
      year.toString(),
    (error, result) => {
      if (error) {
        console.log(error);
      } else {
        for (var i = 0; i < result.length; i++) {
          var theDate = new Date(result[i]['registrationDate']);
          var month = theDate.getMonth() + 1;
          var day = theDate.getDate();

          switch (month) {
            case 1:
              arrangDays(jan, day);

              break;
            case 2:
              arrangDays(Feb, day);

              break;
            case 3:
              arrangDays(Mar, day);
              break;
            case 4:
              arrangDays(aprile, day);
              break;
            case 5:
              arrangDays(may, day);
              break;
            case 6:
              arrangDays(jan, day);
              break;
            case 7:
              arrangDays(jul, day);
              break;
            case 8:
              arrangDays(ogst, day);
              break;
            case 9:
              arrangDays(sept, day);
              break;
            case 10:
              arrangDays(oct, day);
              break;
            case 11:
              arrangDays(nov, day);
              break;
            case 12:
              arrangDays(dec, day);
              break;

            //------------------------------ end of week 1 -----------------------------------//

            //-------------------------------- end of Case 1 jan Month---------------------------//
          }
        }

        // console.log('1111111111111');
        //---------------------- end of the for --------------------------------------------------//

        //------------------------ if the year is for this existance year the we need reach to the now month ---------------------//
        var nowYear = new Date().getFullYear();
        var CurrentMonth = new Date().getMonth() + 1;
        if (year == nowYear) {
          //   console.log(new Date().getMonth() + 1);

          var monthArray = {
            jan,
            Feb,
            Mar,
            aprile,
            may,
            jun,
            jul,
            ogst,
            sept,
            oct,
            nov,
            dec,
          };
          var count = 0;
          for (var key in monthArray) {
            if (count < CurrentMonth) {
              appDownload[key] = monthArray[key];
              ++count;
            } else {
              break;
            }
          }
        } else if (parseInt(year) < parseInt(nowYear)) {
          appDownload = {
            jan,
            Feb,
            Mar,
            aprile,
            may,
            jun,
            jul,
            ogst,
            sept,
            oct,
            nov,
            dec,
          };
        }
        cb(appDownload);
        // console.log({ appDownload });
      }
    }
  );
}

//---------------------------------------------------------------------------------------------------------------------------------------//
//-------------------------------------- create the TimeViewed  & TimeSpendOnArticle from Articles --------------------------------------//
//---------------------------------------------------------------------------------------------------------------------------------------//

function GetTimeandTimeSpent(cb) {
  var TimeReviwed = [];
  db.query(
    'SELECT Article.TimesViewd,Article.TimeSpendOnArticle,Topics.TopicID,MODELS.ModelID,Article.ArticleID,Article.Title AS Article, Topics.Title AS Topic ,MODELS.Title AS MODEL FROM `Article` INNER JOIN Topics ON Topics.TopicID = Article.TopicID INNER JOIN MODELS ON Topics.ModelID = MODELS.ModelID',
    (error, result) => {
      if (error) {
        cb();
      } else {
        // console.log(result, 'result');
        console.log(result, 'result');
        //-------------------------------------------- Arrange the result Here -----------------------------------------------------//
        for (var i = 0; i < result.length; i++) {
          var ob = {
            ModelID: result[i]['ModelID'],
            ModelTitle: result[i]['MODEL'],
            TopicID: result[i]['TopicID'],
            TopicTiele: result[i]['Topic'],
          };

          var artObjeect = {
            ArticleID: result[i]['ArticleID'],
            ArticlTitle: result[i]['Article'],
            TimeViewed: result[i]['TimesViewd'],
            TimeSpendOnArticle: result[i]['TimeSpendOnArticle'],
          };
          serchObject(ob, artObjeect, TimeReviwed);
        }
        // console.log(TimeReviwed, 'TimeReviwed');
      }
      cb(TimeReviwed);
    }
  );
}

function serchObject(ob, artObjeect, TimeReviwed) {
  var exist = false;
  if (TimeReviwed.length === 0) {
    ob.Articles = [artObjeect];
    TimeReviwed.push(ob);
  } else {
    // console.log(
    //   TimeReviwed,
    //   'TimeReviwed',
    //   TimeReviwed.length,
    //   'TimeReviwed.length -------------------------'
    // );
    for (var i = 0; i < TimeReviwed.length; i++) {
      if (
        TimeReviwed[i].ModelID.toString() === ob.ModelID.toString() &&
        TimeReviwed[i].ModelTitle.trim() === ob.ModelTitle.trim() &&
        TimeReviwed[i].TopicID.toString() === ob.TopicID.toString() &&
        TimeReviwed[i].TopicTiele.trim() === ob.TopicTiele.trim()
      ) {
        exist = true;
        console.log(
          TimeReviwed[i].ModelID + ' ' + ob.ModelID.toString(),
          TimeReviwed[i].ModelTitle + ' ' + ob.ModelTitle,
          TimeReviwed[i]
        );
        //----------------------- if there is a model in this object then look for the articles inside it -------------------------------//
        if (TimeReviwed[i].hasOwnProperty('Articles')) {
          //---------------- HERE we check if the Object is Exist ------------------------------------------------------------------//
          // TimeReviwed[i].Articles.includes(artObjeect);
          if (!isExist(TimeReviwed[i].Articles, artObjeect)) {
            console.log(
              '----------------------------not includede ------------------------'
            );
            TimeReviwed[i]['Articles'].push(artObjeect);
            // console.log(TimeReviwed[i]);
          }
        } else {
          //------------------ if there is no articles array then create one --------------------------------------//
          TimeReviwed[i]['Articles'] = [];
          TimeReviwed[i]['Articles'].push(artObjeect);
        }
      }
    }
    if (!exist) {
      ob.Articles = [artObjeect];
      TimeReviwed.push(ob);
    }
    // console.log(TimeReviwed, 'TimeReviwed');
  }

  // console.log(TimeReviwed, 'TimeReviwed');
  // cb(TimeReviwed);
}

function isExist(array, obect) {
  var included = false;
  for (var i = 0; i < array.length; i++) {
    for (var key in obect) {
      included = included && array[i][key] === obect[key];
    }
    // console.log(array[i], obect, included);
    if (included) {
      return included;
    }
  }
  return false;
}
// GetTimeandTimeSpent();

// getRegisteration(2020, (appDownload) => {
//   jsonObject.appDownload = appDownload;
//   GetTimeandTimeSpent((TimeReviwed) => {
//     // console.log(appDownload);
//     jsonObject.TimeReviwed = TimeReviwed;
//     console.log('don', jsonObject);
//     //----------------------------------------------------------//
//     var file = path.join(__dirname, '../data/ChartData.json');

//     fs.writeFile(file, JSON.stringify(jsonObject), (error) => {
//       if (error) {
//         console.log(error);
//       } else {
//         console.log('doooooooooooooooooone');
//       }
//     });
//   });
// });

function wirteJsonFile(year, cb) {
  var jsonObject = {};
  var file = path.join(__dirname, '../data/ChartData.json');

  // fs.writeFile(file, JSON.stringify({}), (error) => {
  //   if (error) {
  //     console.log(error);
  //   } else {
  //     console.log('doooooooooooooooooone');
  //   }
  // });

  // console.log(year, 'year-----------------');
  getRegisteration(year, (appDownload) => {
    jsonObject.appDownload = appDownload;
    // console.log('//////////////////////////////////');
    GetTimeandTimeSpent((TimeReviwed) => {
      // console.log(appDownload);
      jsonObject.TimeReviwed = TimeReviwed;
      // console.log('don');
      //----------------------------------------------------------//

      fs.writeFile(file, JSON.stringify(jsonObject), (error) => {
        if (error) {
          console.log(error);
          cb(error);
        } else {
          cb();
          appDownload = {};
          TimeReviwed = [];
          jsonObject = {};
          console.log('doooooooooooooooooone');
        }
      });
    });
  });
}

// wirteJsonFile('2020');
module.exports = {
  wirteJsonFile: wirteJsonFile,
  GetTimeandTimeSpent: GetTimeandTimeSpent,
};

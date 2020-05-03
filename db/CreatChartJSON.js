// import { promises as fs } from 'fs';
const db = require('./db');
const fs = require('fs');
const path = require('path');
var modules = [];
var cc = false;

var object = {};

//-------------------------- Creat an inital value to all Months of the Year --------------------------------//
var jan = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var Feb = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var Mar = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var aprile = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var may = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var jun = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var jul = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var ogst = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var sept = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var oct = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var nov = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
};
var dec = {
  Week1: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week2: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0] },
  Week3: { tatal: 0, days: [0, 0, 0, 0, 0, 0, 0, 0, 0] },
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
  console.log(month);
}

// -------------------------------------------------------------------------------------------------------------------------------------------------//
//----------------------------------- afunction to create a ne object contains the number of downloads for each month and week ---------------------//
//--------------------------------------------------------------------------------------------------------------------------------------------------//
function getRegisteration(year) {
  db.query(
    'SELECT * FROM MobRegistration WHERE YEAR(registrationDate)=' + year,
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
              console.log('jan');
              break;
            case 2:
              arrangDays(Feb, day);
              console.log('Feb');
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

        //---------------------- end of the for --------------------------------------------------//
        object = {
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
        console.log(object);
      }
    }
  );
}

getRegisteration(2020);

// arrangDays(jan, 7);
// arrangDays(jan, 5);
// arrangDays(jan, 2);
// arrangDays(jan, 4);
// arrangDays(jan, 3);

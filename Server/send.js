var admin = require('firebase-admin');
var path = require('path');
var serviceAccount = require('./ncdp-270519-firebase-adminsdk-7vzkv-07bdff9001.json');
var db = require('../db/models');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ncdp-270519.firebaseio.com',
});

function sendMessage(RegistrationTokens, cb) {
  // var registrationToken =
  //   'dHAT7WB6Q-uvqpXtmcgM4E:APA91bFnMKAtY8QMpRrc5TpSdiEuyMYT3bXcEWRl5rDkQvDrIkY_qbCs1i7ixkGZutgqvA6xIIG2Kwojvfd39hYk2UCIDfKBIot4yo0Zew8d8L1rw5xRm0CK8bcgePUDWl72lCFbS6ND';

  //------------------------------- Creat the Body Of the Notification ----------------------------------------------//
  var palyload = {
    notification: {
      title: ' تحديثات جديده  ',
      body: 'يوجد مقالات جديده تم نشرها هل تريد التحديث؟',
      sound: 'default',
      badge: '1',
    },
    data: {
      title: 'json file',
      body: JSON.stringify(db),
      click_action: 'FLUTTER_NOTIFICATION_CLICK',
    },
  };

  var options = {
    priority: 'high',
    timeToLive: 60 * 60 * 24,
  };

  //----------------------------- sending the message to all Devices Registered to application ------------------------//
  for (var i = 0; i < RegistrationTokens.length; i++) {
    try {
      admin
        .messaging()
        .sendToDevice(RegistrationTokens[i].Token, palyload, options)
        .then((response) => {
          console.log('successfully send message :', response);
        })
        .catch((error) => {
          console.log('Error sending message', error);
          cb(' خطأ بإرسال الإشعرات');
        });
    } catch {
      cb(' خطأ بإرسال الإشعرات');
    }
  }
  //------------------------------ calling the Callback Function with null argument since there is no errors --------------------//
  cb();
}

module.exports = {
  sendMessage,
};

var admin = require('firebase-admin');
var serviceAccount = require('./ncdp-270519-firebase-adminsdk-7vzkv-07bdff9001.json');
// console.log(serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ncdp-270519.firebaseio.com',
});
var registrationToken =
  'dHAT7WB6Q-uvqpXtmcgM4E:APA91bFnMKAtY8QMpRrc5TpSdiEuyMYT3bXcEWRl5rDkQvDrIkY_qbCs1i7ixkGZutgqvA6xIIG2Kwojvfd39hYk2UCIDfKBIot4yo0Zew8d8L1rw5xRm0CK8bcgePUDWl72lCFbS6ND';

var palyload = {
  notification: {
    title: 'Test Notification Title',
    body: 'Test Notification Body',
    sound: 'default',
    badge: '1',
  },
  data: {
    title: ' this is the first try for data',
    body: 'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',
    click_action: 'FLUTTER_NOTIFICATION_CLICK',
  },
};

var options = {
  priority: 'high',
  timeToLive: 60 * 60 * 24,
};

admin
  .messaging()
  .sendToDevice(registrationToken, palyload, options)
  .then((response) => {
    console.log('successfully send message :', response);
  })
  .catch((error) => {
    console.log('Error sending message', error);
  });

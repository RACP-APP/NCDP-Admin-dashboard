var admin = require('firebase-admin');
var serviceAccount = require('./ncdp-270519-firebase-adminsdk-7vzkv-07bdff9001.json');
// console.log(serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://ncdp-270519.firebaseio.com'
});
var registrationToken =
  'dE-gVKhESMi4xUAci_m6kV:APA91bEGXLuA1wY34ehC2uT1bJQa128M8d03P1DJt_vtNxwUClr56dVGTxvn88aCUux8z-D7TDkw9GsLY1OGMDWe8F2XUFSTtVGrtnaQ0uaeUEHrC2JsXurS0keawEiJBXOUZVmvPjxU';

var palyload = {
  data: {
    myKey1: 'hellow'
  }
};

var options = {
  priority: 'high',
  timeToLive: 60 * 60 * 24
};

admin
  .messaging()
  .sendToDevice(registrationToken, palyload, options)
  .then(response => {
    console.log('successfully send message :', response);
  })
  .catch(error => {
    console.log('Error sending message', error);
  });

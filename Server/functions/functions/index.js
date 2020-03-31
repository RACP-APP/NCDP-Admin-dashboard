const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.sendNotificationToTopic = functions.firestore
  .document('puppies/{uid}')
  .onWrite(async event => {
    // let docID =
    let title = event.after.get('title');
    let content = event.after.get('content');
    var message = {
      notification: {
        title: title,
        body: content
      },
      topic: 'namelesscoder'
    };
    let response = await admin.messaging().send(message);
    console.log(response);
  });

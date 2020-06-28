const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
const nodemailer = require('nodemailer');

// var auth = {
//   type: 'oauth2',
//   user: 'ncdpmailer@gmail.com',
//   clientId:
//     '1016455203993-37gnufv6o4jkfrlj3srufk642s544c9v.apps.googleusercontent.com',
//   clientSecret: 'RGikMN2GyuChyIgiUkdQtrPH',
//   refreshToken:
//     '1//044mApoZHI6yVCgYIARAAGAQSNwF-L9IrwKjnnOVMedlTQXY27XeoNZQ9eqjyCalaUykIwMtYBfXpyNGbw9PHYhj6WvNS62ltHiA',
// };

// If modifying these scopes, delete token.json.
// const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
// // The file token.json stores the user's access and refresh tokens, and is
// // created automatically when the authorization flow completes for the first
// // time.
const TOKEN_PATH = 'token.json';

// // Load client secrets from a local file.
fs.readFile('server/credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Gmail API.
  authorize(JSON.parse(content), listLabels);
});

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.web;
  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the labels in the user's account.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function listLabels(auth) {
  const gmail = google.gmail({ version: 'v1', auth });
  gmail.users.labels.list(
    {
      userId: 'me',
    },
    (err, res) => {
      if (err) return console.log('The API returned an error: ' + err);
      const labels = res.data.labels;
      if (labels.length) {
        console.log('Labels:');
        labels.forEach((label) => {
          console.log(`- ${label.name}`);
        });
      } else {
        console.log('No labels found.');
      }
    }
  );
}

function sendMail(compID, post) {
  let mail = {
    from: 'ncdpmailer@gmail.com', // sender address
    to: 'ncdpmailer@gmail.com', // list of receivers
    subject: 'FINALLY posted ✔ ', // Subject line
    text: 'a new post has been added! grab the chance ^_^', // plain text body
    html: `<h3>${post.description} >>>>> ${post.link}</h3>`, // html body
    //   attachments: [{filename: 'me.jpg', path: '../me.jpg'}]
  };
  transporter.sendMail(mail, (err, mail) => {
    if (err) {
      console.log('err in sending email >>>>>>>>>>> ', err);
    } else {
      console.log('email is sent wow !!!!!');
    }
  });
}

let transporter = nodemailer.createTransport({
  // host: 'smtp.gmail.com',
  // port: 465,
  // secure: true,
  // auth: {
  //   type: 'OAuth2',
  //   user: 'ncdpmailer@gmail.com',
  //   accessToken:
  //     'ya29.a0AfH6SMDVTJL3xzJcC05JEewRk9ebT7UyuMNC6v43Tnjrl1NekNiIVo8u2UZBS-qxveMDxP4BkJgsvTlN2LQW--DakDoTMCzVhuoqEcHrI0IPvB2PH4lOe40VBQKEI4Gxeu8FQUH3-PUzdwdx6Gz2quZa-AkV4HuW1Ps',
  // },
  service: 'gmail',
  auth: {
    user: 'ncdpmailer@gmail.com',
    pass: 'qlynreemvdutawqo',
  },
});

let pst = {
  id: 1,
  comId: 39,
  title: 'Perferendis temporibus voluptas.',
  description:
    'Ea eligendi maxime illo sed voluptatem rerum ut nulla tempore. Molesti...',
  deadLine: '2020-08-18T05:44:12.355+00:00',
  major: 'Medicine',
  logo: 'https://lorempixel.com/640/480/business',
  type: 'jop',
  archived: false,
  read: true,
  link: 'https://www.google.com/',
};

var Mailling = (to, Subject, Html, Text) => {
  console.log(to, Subject, Html, Text);
  transporter
    .sendMail({
      from: '"NCDP Dashboard 👻" <ncdpmailer@gmail.com>', // sender address
      to: to + ', nuhlamasri@gmail.com', // list of receivers
      subject: Subject + ' ✔', // Subject line
      html: Html, // html body
    })
    .then((result) => {
      console.log('email is sent');
    })
    .catch((error) => {
      console.log(error);
    });
};
// sendMail(8, pst);

module.exports = {
  Mailling: Mailling,
};

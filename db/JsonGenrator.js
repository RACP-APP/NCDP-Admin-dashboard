// import { promises as fs } from 'fs';
const db = require('./db');
const fs = require('fs');
var modules = [];
var cc = false;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

async function writeotfile(object) {
  try {
    await fs.writeFileSync('./phraseFreqs.json', JSON.stringify(object));
    console.log('hiiiiiiiiiiiiiiiiiiiiiiiiiiiii2');
  } catch {
    console.log('errrrrrrrrrrrrrrror');
  }
}
function theData() {}
async function getData(cb) {
  await db
    .query(
      'SELECT MODELS.* ,users.userName from  MODELS , `USERS` users Where CreatedBy = users.userID ',
      async function(err, result) {
        object = [];
        if (result) {
          for (var j = 0; j < result.length; j++) {
            var d = JSON.stringify(result[j]);
            object.push(JSON.parse(d));
          }

          if (result.length === 0) {
            cb(object);
            return;
          }

          for (let i = 0; i < object.length; i++) {
            ///----------------------------- get all topic of each model ----------------//
            var cout = i;
            await db.query(
              'SELECT Topics.* from  Topics  Where Topics.ModelID = ' +
                result[i]['ModelID'],
              async function(error, result) {
                if (error) {
                  console.log(err);
                } else {
                  var topics = [];
                  for (var t = 0; t < result.length; t++) {
                    var d = JSON.stringify(result[t]);
                    topics.push(JSON.parse(d));
                  }
                  object[i]['Topics'] = topics;
                  if (result.length === 0) {
                    cb(object);
                    return;
                  }
                  // var account = 0;
                  //----------------------------- get all Articles of topic --------------------//
                  for (let articl = 0; articl < topics.length; articl++) {
                    await db.query(
                      'SELECT Article.* , users.userName as createBy, users.userName as UpdatedBy from  Article  , `USERS` users  Where  Article.UpdateByUser=users.userID  AND  Article.CreatedByUser=users.userID  AND Article.TopicID = ' +
                        result[articl]['TopicID'],
                      async function(error, result) {
                        if (err) {
                        } else {
                          var articls = [];
                          // console.log(result.length, 'artcles numbers');
                          for (var t = 0; t < result.length; t++) {
                            var d = JSON.stringify(result[t]);
                            articls.push(JSON.parse(d));
                          }
                          object[i]['Topics'][articl]['Article'] = articls;
                          if (result.length === 0) {
                            cb(object);
                            return;
                          }

                          //----------------------- Get All content in the Articles ---------------------//
                          for (
                            let content = 0;
                            content < articls.length;
                            content++
                          ) {
                            await db.query(
                              ' SELECT Content.* from  Content  Where Content.ArticleID =' +
                                result[content]['ArticleID'],
                              async function(error, result) {
                                if (error) {
                                  // console.log('error in content');
                                } else {
                                  // console.log(result);
                                  var contents = [];
                                  for (var t = 0; t < result.length; t++) {
                                    var d = JSON.stringify(result[t]);
                                    contents.push(JSON.parse(d));
                                  }
                                  object[i]['Topics'][articl]['Article'][
                                    content
                                  ]['content'] = contents;
                                  if (result.length === 0) {
                                    cb(object);
                                    return;
                                  }
                                  //--------------------------------get Text -----------------------------------------------//
                                  for (
                                    let medi = 0;
                                    medi < contents.length;
                                    medi++
                                  ) {
                                    cc = false;
                                    await db.query(
                                      '  SELECT Text.* from  `TEXT` Text  Where Text.ContentID =' +
                                        contents[medi]['contentID'],
                                      async (err, result) => {
                                        if (err) {
                                          // console.log(err);
                                        } else {
                                          var Text = [];
                                          for (
                                            var t = 0;
                                            t < result.length;
                                            t++
                                          ) {
                                            var d = JSON.stringify(result[t]);
                                            Text.push(JSON.parse(d));
                                          }
                                          object[i]['Topics'][articl][
                                            'Article'
                                          ][content]['content'][medi][
                                            'text'
                                          ] = Text;
                                        }

                                        // ----------------------------------------------//
                                        // ----------------------------------------------//
                                        for (
                                          let m = 0;
                                          m < contents.length;
                                          m++
                                        ) {
                                          cc = false;

                                          await db.query(
                                            'SELECT Media.* from  Media  Where Media.ContentID =' +
                                              contents[m]['contentID'],
                                            function(err, res) {
                                              if (err) {
                                                // console.log(err);
                                              } else {
                                                var MyMedia = [];
                                                for (
                                                  var t = 0;
                                                  t < res.length;
                                                  t++
                                                ) {
                                                  var d = JSON.stringify(
                                                    res[t]
                                                  );
                                                  MyMedia.push(JSON.parse(d));
                                                }
                                                object[i]['Topics'][articl][
                                                  'Article'
                                                ][content]['content'][m][
                                                  'Media'
                                                ] = MyMedia;
                                              }
                                            }
                                          );
                                        }
                                        console.log(
                                          ' contents.length',
                                          contents.length,
                                          'articl',
                                          articl,
                                          'content',
                                          content
                                        );

                                        cb(object);
                                      }
                                    );
                                  }

                                  //------------------------------- get media ------------------------------------------//
                                }
                              }
                            );
                          }
                          cc = true;
                          console.log('hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh');
                        }
                      }
                    );
                  }
                }
              }
            );
            console.log(i, 'i');
          }
        } else {
          console.log(err);
        }
      }
    )
    .on('end', () => {
      console.log('dooooooooooooooooooppppppppppppppppppppppppppppgggggggg');
    });
}

var creatJson = async () => {
  console.log('hiiiiiiiiiiiiiiiiiiii');
  try {
    await getData(writeotfile).then(() => {
      console.log('dddddddddddddddddddddddddddooooooooooooooooooon');
    });
    console.log('22222222222');
  } catch {}
  // .catch(error => {
  //   cb(error, null);
  // });
};
module.exports = {
  creatJson: creatJson
};

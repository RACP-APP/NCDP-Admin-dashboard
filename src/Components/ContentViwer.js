import React from 'react';
import '../css/component.css';
import '../css/buttonStyles.css';
import axios from 'axios';
import config from '../config.json';
import $ from 'jquery';
import Editor from './contentComponents/Editor';
import TextItem from './contentComponents/TextItem';
import VedioConmponent from './contentComponents/VedioComponentList';
import LoadingScreen from 'react-loading-screen';
import AudioPlayerContent from './contentComponents/AudioItem';
import ImageConten from './contentComponents/imageContent';
import Wordconverter from './contentComponents/ConvertWord';
import FileUploader from 'react-firebase-file-uploader';
import ImageFileUploader from '../Components/uploadimage';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import firebase from 'firebase';
import ContentViweing from './contentComponents/ContentViweing';
import { Segment, Button, Table, Grid } from 'semantic-ui-react';

class ContentViwer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentText: 'ytttttttt',
      currentTextID: null,
      addMode: false,
      errorMessage: '',
      ModuleID: parseInt(localStorage.getItem('selectedModel')),
      Title: '',
      TextContent: this.props.data['Text'],
      MediaContent: [
        ...this.props.data['Media'],
        ...this.props.data['Text'], // sorting the Media Array to get right order
      ].sort((a, b) => {
        return a.MediaOrder - b.MediaOrder;
      }),
      contentID: this.props.data['contentID'],
      disabled: true,
      selectedFile: null,
      loading: false,
      vedioURL: '',
      audioURL: '',
      ImageUrl: '',
    };
    this.closeEditor = this.closeEditor.bind(this);
    this.OpenEditor = this.OpenEditor.bind(this);
    this.saveTextContent = this.saveTextContent.bind(this);
    this.getAllMedia = this.getAllMedia.bind(this);
    this.EditText2 = this.EditText2.bind(this);
    this.onClickHandlerForAudio = this.onClickHandlerForAudio.bind(this);
  }

  //-----------------------function to handel uploading to firbase ----------------//

  handelloadStart(e) {
    this.setState({ loading: true });
  }
  handelSucces(e) {
    console.log(firebase.storage().app.remoteConfig());
    firebase
      .storage()
      .ref()
      .child('Vedios')
      .child(e)
      .getDownloadURL()
      .then((url) => {
        console.log(url);
        this.setState({ vedioURL: url, loading: false }, () => {
          this.onVedioSucsessHandler();
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //--------------------------- handel Audio Uploading --------------------------------------------------------//
  AudiohandelSucces(e) {
    console.log(firebase.storage().app.remoteConfig());
    firebase
      .storage()
      .ref()
      .child('Audio')
      .child(e)
      .getDownloadURL()
      .then((url) => {
        console.log(url);
        this.setState({ audioURL: url, loading: false }, () => {
          this.onClickHandlerForAudio();
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  //---------------------------------------- Handel Image Uploadin --------------------------------------------//
  ImageshandelSucces(e) {
    this.setState({ ImageUrl: e, loading: false }, () => {
      this.onClickHandlerForImages();
    });
  }

  isReordered() {
    this.getAllContentText();
    this.getAllMedia();
    localStorage.setItem('ContentUpdate', '1');
  }
  //-----------------------------------------------Get all Media agine ------------------------------------------//
  getAllMedia() {
    axios
      .post(config[0].server + 'Articles/GetAllMedia', {
        ContentID: this.props.data['contentID'],
      })
      .then((result) => {
        this.setState({
          MediaContent: [...result.data, ...this.state.TextContent].sort(
            (a, b) => {
              return a.MediaOrder - b.MediaOrder;
            }
          ),
          loading: false,
          ImageUrl: '',
          audioURL: '',
          vedioURL: '',
        });
      })
      .catch((error) => {
        this.setState({
          errorMessage: error[0],
        });
      });
  }
  //------------------------------------ Update content to DataBase ----------------------------------------------//
  UpdateTextContent(HTMLdata) {
    if (HTMLdata !== '') {
      console.log(HTMLdata, 'FORM CONTENT Viwer');
      axios
        .post(config[0].server + 'Articles/UpdateTex', {
          TextID: this.state.currentTextID,
          ContentText: HTMLdata,
        })
        .then((result) => {
          this.getAllContentText();
          localStorage.setItem('ContentUpdate', '1');

          console.log('تم');
          // this.setState({ currentText: '', currentTextID: });
        })
        .catch((error) => {
          this.setState({
            errorMessage: error,
            currentText: '',
            currentTextID: null,
          });
        });
    }
  }
  //--------------------------- a function to save the Data from the editor into TEXT Table ----------------------//
  saveTextContent(HTMLdata) {
    if (HTMLdata !== '') {
      var count =
        this.state.MediaContent.length + this.state.TextContent.length + 1;

      axios
        .post(config[0].server + 'Articles/InsertText', {
          ContentID: this.props.data['contentID'],
          ContentText: HTMLdata,
          MediaOrder: parseInt(count),
        })
        .then((result) => {
          this.getAllContentText();
          localStorage.setItem('ContentUpdate', '1');
        })
        .catch((error) => {
          this.setState({
            errorMessage: error,
          });
        });
    }
  }
  //-----------------------------Update the  Text Conten Of the Viwer----------------//
  getAllContentText() {
    axios
      .post(config[0].server + 'Articles/gettText', {
        contentID: this.props.data['contentID'],
      })
      .then((result) => {
        this.setState(
          {
            TextContent: result.data,
          },
          () => {
            this.getAllMedia();
            this.closeEditor();
          }
        );
      })
      .catch((error) => {
        this.setState({
          errorMessage: error,
        });
      });
  }
  //---------------------------- a func to open the Didtor ----------------------------//
  OpenEditor() {
    this.setState(
      {
        currentText: null,
      },
      () => {
        $('.editor').css('width', '100%');
      }
    );
  }

  //---------------------------- a func to open the Didtor ----------------------------//

  closeEditor() {
    $('.editor').css('width', '0px');
  }

  //----------------------  a function to Delte a Text --------------------------------//
  DeleteText(e) {
    console.log(e.target.id);
    axios
      .post(config[0].server + 'Articles/DeletetTexts', {
        TextIDs: [e.target.id],
      })
      .then((result) => {
        console.log(result);
        this.getAllContentText();
        localStorage.setItem('ContentUpdate', '1');
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //------------------------- Delete all Checked Box's ----------------------//
  DeleteTextAll() {
    var idarray = $("input[name='deletChekBox']:checked");
    var deletTextIDS = [];
    for (var i = 0; i < idarray.length; i++) {
      console.log($(idarray[i]).attr('id'));
      deletTextIDS.push(parseInt($(idarray[i]).attr('id').substr(2)));
    }

    axios
      .post(config[0].server + 'Articles/DeletetTexts', {
        TextIDs: deletTextIDS,
      })
      .then((result) => {
        this.getAllContentText();
        localStorage.setItem('ContentUpdate', '1');
      })
      .catch((error) => {
        console.log(error);
      });
  }
  //---------------------------------------------------------------//
  //----------------Uplaod Fanctionality //------------------------//
  //---------------------------------------------------------------//
  handleDropdownChange(e) {
    console.log(e.target.value);
    if (e.target.value === 'non') {
      this.setState({
        type: e.target.value,
        disabled: true,
      });
    } else {
      this.setState({ type: e.target.value, disabled: false });
    }
  }
  onChangeHandler = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0,
    });
  };
  onClickHandlerForAudio = () => {
    this.setState(
      {
        loading: true,
      },
      () => {
        localStorage.setItem('ContentUpdate', '1');
      }
    );

    var path = this.state.audioURL;

    var order =
      this.state.MediaContent.length + this.state.TextContent.length + 1;
    axios
      .post(config[0].server + 'Articles/InsertMedia', {
        ContentID: this.props.data['contentID'],
        MediaLink: this.state.audioURL,
        MediaOrder: order,
        MediaType: 'audio',
      })
      .then((reslt) => {
        localStorage.setItem('ContentUpdate', '1');

        this.getAllMedia();
      })
      .catch((error) => {
        this.setState({
          errorMessage: error,
        });
      });
  };

  onClickHandlerForImages = (e) => {
    this.setState(
      {
        loading: true,
      },
      () => {
        localStorage.setItem('ContentUpdate', '1');
      }
    );

    console.log("this.props.data['ContentID']", this.props.data['contentID']);
    var path = this.state.ImageUrl;

    var order =
      this.state.MediaContent.length + this.state.TextContent.length + 1;
    axios
      .post(config[0].server + 'Articles/InsertMedia', {
        ContentID: this.props.data['contentID'],
        MediaLink: path,
        MediaOrder:
          this.props.data['Media'].length + this.props.data['Text'].length + 1,
        MediaType: 'Image',
      })
      .then((reslt) => {
        localStorage.setItem('ContentUpdate', '1');

        this.getAllMedia();
      })
      .catch((error) => {
        this.setState({
          errorMessage: error,
          ImageUrl: '',
        });
      });
  };
  onVedioSucsessHandler = () => {
    // then print response status

    var path = this.state.vedioURL;

    var order =
      this.state.MediaContent.length + this.state.TextContent.length + 1;
    axios
      .post(config[0].server + 'Articles/InsertMedia', {
        ContentID: this.props.data['contentID'],
        MediaLink: path,
        MediaOrder: order,
        MediaType: 'vedio',
      })
      .then((reslt) => {
        localStorage.setItem('ContentUpdate', '1');

        this.getAllMedia();
      })
      .catch((error) => {
        this.setState({
          errorMessage: error,
          loading: false,
        });
      });
  };

  //---------------------- a function to update the editor state and get the text----------------//
  EditText2(e) {
    e.stopPropagation();

    this.setState(
      {
        currentText: this.state.TextContent[parseInt(e.target.id)][
          'ContentText'
        ],
        currentTextID: this.state.TextContent[parseInt(e.target.id)]['TextID'],
      },
      () => {
        $('.editor').css('width', '100%');
      }
    );
  }

  render() {
    return (
      <div style={{ minWidth: '100%' }} dir="rtl">
        <LoadingScreen
          style={{ maxHeight: '700px' }}
          loading={this.state.loading}
          spinnerColor="#9ee5f8"
          textColor="#676767"
          logoSrc={process.env.PUBLIC_URL + '/' + config[0].logo}
          text="يرجى الانتظار حتى اكتمال التحميل "
        ></LoadingScreen>
        <Grid style={{ width: '100%' }}>
          <Grid.Row>
            <Grid.Column width={16}>
              <Segment raised>
                <div className="row">
                  <Button
                    circular
                    icon="step backward"
                    onClick={(e) => {
                      this.props.convertToTopic();
                    }}
                  />
                </div>
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={4}>
              <div className=" editor">
                <Editor
                  data={this.state.currentText}
                  closeEditor={this.closeEditor.bind(this)}
                  saveTextContent={this.saveTextContent.bind(this)}
                  UpdateTextContent={this.UpdateTextContent.bind(this)}
                  handlePastedText={() => true}
                ></Editor>
              </div>

              <div
                className="accordion"
                id="accordionExample"
                style={{ width: '100%' }}
              >
                <div className="card">
                  <div className="card-header" id="headingOne">
                    <h2 className="mb-0">
                      <button
                        className="btn btn-link accordianTitle"
                        type="button"
                        data-toggle="collapse"
                        data-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        المحتوى النصي
                      </button>
                    </h2>
                  </div>

                  <div
                    id="collapseOne"
                    className="collapse show"
                    aria-labelledby="headingOne"
                    data-parent="#accordionExample"
                  >
                    <div className="container">
                      <div className="row ">
                        <Button.Group basic vertical style={{ width: '100%' }}>
                          <Button
                            icon="add circle"
                            content="أضافة جديد"
                            onClick={this.OpenEditor.bind(this)}
                          />
                          <Button
                            icon="إلغـاء"
                            content="إلغاء المحدد "
                            onClick={this.DeleteTextAll.bind(this)}
                          />
                        </Button.Group>

                        <span className="note_add	" />
                        <Wordconverter
                          getAllContentText={this.getAllContentText.bind(this)}
                          contentID={this.props.data['contentID']}
                          MediaOrder={
                            this.props.data['Text'].length +
                            this.props.data['Media'].length +
                            1
                          }
                        />
                      </div>

                      {this.state.TextContent.map((TextItemData, index) => {
                        //////////////////////////////////////////////TEXT /////////////////////////////////////////////////
                        return (
                          <div id={TextItemData['TextID']} dir="rtl">
                            <Table color="blue">
                              <Table.Body>
                                <Table.Row>
                                  <Table.Cell>
                                    <span
                                      id={index}
                                      className="glyphicon glyphicon-pencil ItemIcons"
                                      onClick={this.EditText2.bind(this)}
                                    ></span>
                                  </Table.Cell>
                                  <Table.Cell>
                                    <span
                                      id={TextItemData['TextID']}
                                      key={TextItemData['TextID']}
                                      className="glyphicon glyphicon-remove ItemIcons"
                                      onClick={this.DeleteText.bind(this)}
                                    ></span>
                                  </Table.Cell>
                                  <Table.Cell>
                                    <input
                                      className="ItemIcons"
                                      type="checkbox"
                                      name="deletChekBox"
                                      id={'d-' + TextItemData['TextID']}
                                    />
                                  </Table.Cell>
                                </Table.Row>
                              </Table.Body>
                              <Table.Footer fullWidth>
                                <Table.Row>
                                  <Table.HeaderCell colSpan="3">
                                    <TextItem data={TextItemData}></TextItem>
                                  </Table.HeaderCell>
                                </Table.Row>
                              </Table.Footer>
                            </Table>

                            <div className="row"></div>
                            <div className="row unclickibl"></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="card" dir="rtl">
                  <div className="card-header" id="headingTwo">
                    <h2 className="mb-0">
                      <button
                        className="btn btn-link collapsed accordianTitle"
                        type="button"
                        data-toggle="collapse"
                        data-target="#collapseTwo"
                        aria-expanded="false"
                        aria-controls="collapseTwo"
                      >
                        الفيديو
                      </button>
                    </h2>
                  </div>
                  <div
                    id="collapseTwo"
                    className="collapse"
                    aria-labelledby="headingTwo"
                    data-parent="#accordionExample"
                  >
                    <div className="card-body">
                      <form method="post" action="#" id="#" className="border ">
                        <div className="form-group files">
                          <label>
                            <span className="glyphicon glyphicon-upload  ItemIcons imageUploadingSpan"></span>
                            <FileUploader
                              hidden
                              accept=".WEBM, .MPG, .MPEG,  .MPV, .OGG, .MP4 ,.M4P, .M4V ,.MOV,.AVCHD "
                              name="image"
                              storageRef={firebase
                                .storage()
                                .ref()
                                .child('Vedios')}
                              onUploadStart={this.handelloadStart.bind(this)}
                              onUploadSuccess={this.handelSucces.bind(this)}
                            ></FileUploader>
                          </label>
                        </div>
                      </form>
                      {/* ///////////////////////////////// /vEDIO //////////////////////////////////////// */}
                      <div className="row">
                        <VedioConmponent
                          getAllMedia={this.getAllMedia.bind(this)}
                          link={this.state.MediaContent}
                        ></VedioConmponent>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card">
                  <div className="card-header" id="headingThree">
                    <h2 className="mb-0">
                      <button
                        className="btn btn-link collapsed accordianTitle"
                        type="button"
                        data-toggle="collapse"
                        data-target="#collapseThree"
                        aria-expanded="false"
                        aria-controls="collapseThree"
                      >
                        المحتوى الصوتي
                      </button>
                    </h2>
                  </div>
                  <div
                    id="collapseThree"
                    className="collapse"
                    aria-labelledby="headingThree"
                    data-parent="#accordionExample"
                  >
                    <div className="card-body">
                      <form method="post" action="#" id="#" className="border ">
                        <div className="form-group files">
                          <label>
                            <span className="glyphicon glyphicon-upload  ItemIcons imageUploadingSpan"></span>
                            <FileUploader
                              hidden
                              accept=".WAV, .MP4, .MP3 ,  .m4a, .3gp, .aa ,.aac, .aax , .act,.aiff ,.amr,.webm, .vox,.ra,.opus,.wma ,.mpc ,.ogg, .oga, .mogg,.raw,.sln,.voc,.vox,.8svx "
                              name="image"
                              storageRef={firebase
                                .storage()
                                .ref()
                                .child('Audio')}
                              onUploadStart={this.handelloadStart.bind(this)}
                              onUploadSuccess={this.AudiohandelSucces.bind(
                                this
                              )}
                            ></FileUploader>
                          </label>
                        </div>
                      </form>
                      <div>
                        <AudioPlayerContent
                          getAllMedia={this.getAllMedia.bind(this)}
                          link={this.state.MediaContent}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="card" dir="rtl">
                  <div className="card-header" id="headingTFour">
                    <h2 className="mb-0">
                      <button
                        className="btn btn-link collapsed accordianTitle"
                        type="button"
                        data-toggle="collapse"
                        data-target="#collapseFour"
                        aria-expanded="false"
                        aria-controls="collapseFour"
                      >
                        محتوى الصور
                      </button>
                    </h2>
                  </div>
                  <div
                    id="collapseFour"
                    className="collapse"
                    aria-labelledby="headingFour"
                    data-parent="#accordionExample"
                  >
                    <div className="card-body">
                      <form method="post" action="#" id="#" className="border ">
                        <div className="form-group files">
                          <ImageFileUploader
                            accept=".TIFF  , .TIF, .JPEG , .JPG, .GIF, .png, .RAW  "
                            name="images"
                            onUploadStart={this.handelloadStart.bind(this)}
                            onUploadSuccess={this.ImageshandelSucces.bind(this)}
                          ></ImageFileUploader>
                        </div>
                      </form>
                      {/* -------------------------- IMAGE S Component are here ---------------------- */}
                      <div>
                        <ImageConten
                          getAllMedia={this.getAllMedia.bind(this)}
                          link={this.state.MediaContent}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Grid.Column>
            <Grid.Column width={12}>
              <ContentViweing
                isReorede={this.isReordered.bind(this)}
                data={this.state.MediaContent}
                contentID={this.state.contentID}
              ></ContentViweing>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row></Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default ContentViwer;

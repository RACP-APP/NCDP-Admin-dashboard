import React from 'react';
import '../css/component.css';
import '../css/buttonStyles.css';
import axios from 'axios';
import config from '../config.json';
import $ from 'jquery';
import FileUploader from '../Components/uploadimage';
import firebase from 'firebase';
import {
  Segment,
  Button,
  Image,
  Grid,
  Modal,
  Label,
  Input,
} from 'semantic-ui-react';

class ModuleControlPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      warinig: false,
      addtionMode: false,
      Title: '',
      selectedFile: null,
      imagePreviewUrl: null,
      type: 0,
      disabled: true,
      loading: 0,
      url: '',
      open: false,
    };
    this.addNewModule = this.addNewModule.bind(this);
  }

  //------------------- Handel firbase upload ---------------------------------------//
  handelloadStart(e) {}

  inPrograss(e) {
    this.setState({
      loading: e,
    });
  }
  handelSucces(e) {
    this.setState({ url: e });
    // firebase
    //   .storage()
    //   .ref()
    //   .child(e)
    //   .getDownloadURL()
    //   .then((url) => {
    //     console.log(url);
    //
    //   });
  }

  //-------------------------navigate the between addion and nonaddion ------------------------//
  addNewModule() {
    this.setState({
      addtionMode: true,
    });
    $('.ui .circular .icon .button').attr(
      'class',
      'ui circular icon button unclickibl disapled'
    );
  }

  onClickHandler = () => {
    //------------------------------saving data in database -----------------------//

    var nowDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var CreatedBy = JSON.parse(localStorage.getItem('user'))['userID'];

    var that = this;

    //------------------------- insrt data after uploading the image ---------------------//

    var Icon = this.state.url;

    axios
      .post(config[0].server + 'Dashbord/addModule', {
        Title: that.state.Title || 'New Model' + Date.now(),
        Icon:
          this.state.url ||
          'https://firebasestorage.googleapis.com/v0/b/ncdp-270519.appspot.com/o/circle-png-circle-icon-1600.png?alt=media&token=a9f1a9fa-08e8-40a8-8c55-a8e4a3bcb005',
        CreatedBy: CreatedBy,
      })
      .then((result) => {
        this.setState(
          {
            addtionMode: false,
            warinig: false,
            warningMessage: '',
            open: false,
            url:
              'https://firebasestorage.googleapis.com/v0/b/ncdp-270519.appspot.com/o/images%2Fcircle-png-circle-icon-1600.png?alt=media&token=1b9d90e2-f5ce-4e08-9bb7-ccd0ce79786c',
          },
          () => {
            that.props.mapModels();
            $('.ui .circular .icon .button').css('ui circular icon button');
          }
        );
      })
      .catch((error) => {
        that.setState({
          warinig: true,
          warningMessage: 'عناوين مكررة',
        });
      });
  };

  addNewArticle() {
    console.log(
      parseInt(localStorage.getItem('CurrentTpic')),
      ' from ArticlControlPanel'
    );
    if (localStorage.getItem('CurrentTpic') !== null) {
      this.setState({
        addtionMode: true,
      });
      $('.ui .circular .icon .button').attr(
        'class',
        'ui circular icon button unclickibl disapled'
      );
    } else {
      this.setState({
        addtionMode: false,
        url: '',
        loading: 0,
      });
    }
  }

  show = () => this.setState({ open: true });
  close = () => this.setState({ open: false });

  render() {
    return (
      <Segment raised inverted>
        <div className="row">
          {/* --------------------- Showing plus ------------------ */}

          <Button
            inverted
            circular
            icon="add circle"
            onClick={this.show.bind(this)}
          ></Button>

          <Modal
            closeOnDimmerClick={false}
            closeOnEscape={true}
            style={{
              maxHeight: '250px',
              left: 0,
              right: 0,
              margin: 'auto',
              overflow: 'auto',
            }}
            size="mini"
            dimmer="blurring"
            open={this.state.open}
            onClose={this.close}
          >
            <Modal.Header>إضافة وحده جديده</Modal.Header>
            <Modal.Content image>
              <Image
                wrapped
                size="small"
                src={
                  this.state.url ||
                  'https://firebasestorage.googleapis.com/v0/b/ncdp-270519.appspot.com/o/images%2Fcircle-png-circle-icon-1600.png?alt=media&token=1b9d90e2-f5ce-4e08-9bb7-ccd0ce79786c'
                }
              />
              <div style={{ position: 'absolute', right: 10, top: '25%' }}>
                <FileUploader
                  accept="image/*"
                  name="images"
                  onUploadStart={this.handelloadStart.bind(this)}
                  onUploadSuccess={this.handelSucces.bind(this)}
                  onProgress={this.inPrograss.bind(this)}
                ></FileUploader>
              </div>
              <Modal.Description>
                <div
                  style={{
                    maxWidth: '300px',
                    left: 0,
                    right: 0,
                    margin: 'auto',
                  }}
                >
                  <Grid>
                    <Grid.Row>
                      <Grid.Column width={16}>
                        <div
                          style={{
                            maxWidth: '300px',
                            left: 0,
                            right: 0,
                            top: 0,
                            bottom: 0,
                            margin: 'auto',
                          }}
                        >
                          <Input
                            labelPosition="right"
                            type="text"
                            placeholder="Amount"
                          >
                            <Label>العنوان</Label>
                            <input
                              placeholder=" أدخل عنوان الحقل - الوحدة المطلوبة"
                              onChange={(e) => {
                                this.setState({
                                  Title: e.target.value,
                                });
                                console.log(e.target.value);
                              }}
                            />
                          </Input>

                          <p style={{ color: 'red', fontWeight: 'bold' }}>
                            {this.state.warningMessage}
                          </p>
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column width={16}></Grid.Column>
                    </Grid.Row>
                  </Grid>
                </div>
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions>
              <div
                style={{
                  textAlign: 'center',
                }}
              >
                <Button.Group basic size="small">
                  <Button
                    icon="cancel"
                    onClick={(e) => {
                      this.setState({
                        addtionMode: false,
                        warinig: false,
                        warningMessage: '',
                        open: false,
                      });
                      $('.glyphicon-plus').attr(
                        'class',
                        'glyphicon glyphicon-plus'
                      );
                    }}
                  />
                  <Button
                    icon="save"
                    onClick={this.onClickHandler.bind(this)}
                  />
                </Button.Group>
              </div>
            </Modal.Actions>
          </Modal>
        </div>
      </Segment>
    );
  }
}

export default ModuleControlPanel;

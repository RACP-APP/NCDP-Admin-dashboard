import React from 'react';
import '../css/component.css';
import '../css/buttonStyles.css';
import axios from 'axios';
import config from '../config.json';
import $ from 'jquery';
import FileUploader from '../Components/uploadimage';
import firebase from 'firebase';
import { Segment, Button, Image, Grid } from 'semantic-ui-react';

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
            warningMessage: 'عناوين مكررة',
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
        console.log(error);
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

  render() {
    return (
      <Segment raised>
        {!this.state.addtionMode ? (
          <div className="row">
            {/* --------------------- Showing plus ------------------ */}

            <Button
              circular
              icon="add circle"
              onClick={this.addNewModule.bind(this)}
            />
          </div>
        ) : (
          <div style={{ maxWidth: '300px', left: 0, right: 0, margin: 'auto' }}>
            <Grid>
              <Grid.Row>
                <Grid.Column width={3}>
                  <Image
                    src={
                      this.state.url ||
                      'https://firebasestorage.googleapis.com/v0/b/ncdp-270519.appspot.com/o/circle-png-circle-icon-1600.png?alt=media&token=a9f1a9fa-08e8-40a8-8c55-a8e4a3bcb005'
                    }
                    avatar
                    size="small"
                  />
                </Grid.Column>
                <Grid.Column width={13}>
                  <input
                    type="text"
                    placeholder=" أدخل عنوان الحقل - الوحدة المطلوبة"
                    onChange={(e) => {
                      this.setState({
                        Title: e.target.value,
                      });
                      console.log(e.target.value);
                    }}
                  />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={3}>
                  <FileUploader
                    accept="image/*"
                    name="images"
                    onUploadStart={this.handelloadStart.bind(this)}
                    onUploadSuccess={this.handelSucces.bind(this)}
                    onProgress={this.inPrograss.bind(this)}
                  ></FileUploader>
                </Grid.Column>
                <Grid.Column width={13}>
                  <Button.Group basic size="small">
                    <Button
                      icon="cancel"
                      onClick={(e) => {
                        this.setState({
                          addtionMode: false,
                          warinig: false,
                          warningMessage: '',
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
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        )}
      </Segment>
    );
  }
}

export default ModuleControlPanel;

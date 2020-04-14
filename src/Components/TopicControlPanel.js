import React from 'react';
import '../css/component.css';
import '../css/buttonStyles.css';
import axios from 'axios';
import config from '../config.json';
import $ from 'jquery';
import FileUploader from '../Components/uploadimage';
import firebase from 'firebase';
import { Segment, Button, Grid, Image, Input } from 'semantic-ui-react';

class TopicControlPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addMode: false,
      ModuleID: parseInt(localStorage.getItem('selectedModel')),
      Title: '',
      url: '',
      loading: 0,
      error: false,
      errorMessage: '',
    };
  }

  handelloadStart(e) {}
  handelSucces(e) {
    this.setState({ url: e });
    console.log(firebase.storage);
    // firebase
    //   .storage()
    //   .ref()
    //   .child(e)
    //   .getDownloadURL()
    //   .then((url) => {
    //     console.log(url);
    //   });
  }

  //-------------------------- the percentege of upl-loading ---------------------//
  inPrograss(e) {
    this.setState({
      loading: e,
    });
  }

  //------------------------------saving data in database -------------------------//
  onClickHandler = () => {
    var object = {};
    var that = this;

    object['Icon'] =
      this.state.url ||
      'https://firebasestorage.googleapis.com/v0/b/ncdp-270519.appspot.com/o/circle-png-circle-icon-1600.png?alt=media&token=a9f1a9fa-08e8-40a8-8c55-a8e4a3bcb005';
    object['Title'] =
      this.state.Title ||
      'New Topic for -' + this.state.ModuleID + '-' + Date.now();
    object['ModelID'] = this.state.ModuleID;

    axios
      .post(config[0].server + 'Dashbord/addTopicToAmodel', object)
      .then((result) => {
        this.setState({
          addMode: false,
          Title: '',
          url: '',
          loading: 0,
          error: false,
          errorMessage: '',
        });
        this.props.updateFromChild();

        $('.glyphicon-plus').attr(
          'class',
          'glyphicon glyphicon-plus ControlePanel-col  '
        );
      })
      .catch((error) => {
        this.setState({
          error: true,
          errorMessage: error.response.data,
        });
      });
  };

  render() {
    if (!this.state.addMode) {
      return (
        <Segment>
          <div className="row">
            {/* --------------------- Showing plus ------------------ */}

            <Button
              circular
              icon="add circle"
              onClick={(e) => {
                this.setState({
                  addMode: true,
                  //---------------//
                });
              }}
            />
          </div>
        </Segment>
      );
    } else {
      return (
        <Segment>
          <Grid style={{ maxWidth: '220px' }}>
            <Grid.Row>
              <Grid.Column width={5}>
                <Image
                  src={
                    this.state.url ||
                    'https://firebasestorage.googleapis.com/v0/b/ncdp-270519.appspot.com/o/circle-png-circle-icon-1600.png?alt=media&token=a9f1a9fa-08e8-40a8-8c55-a8e4a3bcb005'
                  }
                  avatar
                  size="meduim"
                />
              </Grid.Column>
              <Grid.Column width={5}>
                <Input
                  icon="address card"
                  iconPosition="left"
                  style={{ maxWidth: '120px' }}
                  type="text"
                  placeholder="أضف العنوان هنا ...."
                  onChange={(e) => {
                    this.setState({
                      Title: e.target.value,
                    });
                  }}
                />
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={5}>
                <FileUploader
                  accept="image/*"
                  name="images"
                  onUploadStart={this.handelloadStart.bind(this)}
                  onUploadSuccess={this.handelSucces.bind(this)}
                  onProgress={this.inPrograss.bind(this)}
                ></FileUploader>
              </Grid.Column>
              <Grid.Column width={5} style={{ textAlign: 'center' }}>
                <Button.Group basic size="small">
                  <Button
                    icon="cancel"
                    onClick={(e) => {
                      this.setState({
                        addMode: false,
                      });
                      $('.glyphicon-plus').attr(
                        'class',
                        'glyphicon glyphicon-plus ControlePanel-col unclickibl '
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
            {this.state.error ? (
              <Grid.Row>{this.state.errorMessage}</Grid.Row>
            ) : null}
          </Grid>
        </Segment>
      );
    }
  }
}

export default TopicControlPanel;

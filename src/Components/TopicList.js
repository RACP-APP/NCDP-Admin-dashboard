import React from 'react';
import '../css/component.css';
import '../css/buttonStyles.css';
import axios from 'axios';
import $ from 'jquery';
import config from '../config.json';
import Axios from 'axios';
import FileUploader from 'react-firebase-file-uploader';
import firebase from 'firebase';
import { Input, Image, Button } from 'semantic-ui-react';

class ArticlesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Title: '',
      currentModule: this.props.currentModID,
      data: this.props.Artical,
      editionMode: false,
      type: 0,
      disabled: true,
      selectedFile: null,
      imagePreviewUrl: null,
      Wrnining: false,
      WrniningMessage: '',
      url: '',
      loading: 0
    };
    this.editTopic = this.editTopic.bind(this);
    this.DeleteTopic = this.DeleteTopic.bind(this);
    this.UpdateTopic = this.UpdateTopic.bind(this);
  }

  handelloadStart(e) {
    console.log('hhhhhhhhhhhhhhhhh');
  }
  handelSucces(e) {
    firebase
      .storage()
      .ref()
      .child(e)
      .getDownloadURL()
      .then(url => {
        console.log(url);
        this.setState({ url: url });
      });
  }

  inPrograss(e) {
    this.setState({
      loading: e
    });
  }
  //----------------------------------- When the user Confirm Deletion Operation ----------------------------------//
  oktoDeleteTopic(e) {
    axios
      .post(config[0].server + 'Dashbord/DeleteTopic', {
        TopicID: this.state.data['TopicID']
      })
      .then(result => {
        this.setState({
          Wrnining: false
        });
        this.props.goToTopicsViwer();
      })
      .catch(error => {
        console.log(error);
      });
  }

  //----------------------------------------------------------------------//
  //---------------- re-get the data after Updating -----------------------//
  //----------------------------------------------------------------------//
  UpdateTopic() {
    axios
      .post(config[0].server + 'Dashbord/getTopic', {
        ModuleID: this.state.currentModule,
        TopicID: this.state.data['TopicID']
      })
      .then(result => {
        this.setState({
          data: result.data[0]
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  editTopic() {
    this.setState({
      editionMode: true
    });
  }

  onClickHandler = () => {
    //------------------------------saving data in database -----------------------//

    var that = this;
    var Title = this.state.Title || this.state.data['Title'];
    var Icon =
      this.state.url ||
      this.state.data['Icon'] ||
      'https://firebasestorage.googleapis.com/v0/b/ncdp-270519.appspot.com/o/circle-png-circle-icon-1600.png?alt=media&token=a9f1a9fa-08e8-40a8-8c55-a8e4a3bcb005';

    axios
      .post(config[0].server + 'Dashbord/UpdatTopic', {
        Title: Title || 'New Topic ',
        Icon: Icon,
        TopicID: this.state.data['TopicID']
      })
      .then(result => {
        this.UpdateTopic();
        this.setState({
          editionMode: false,
          disabled: true,
          selectedFile: null,
          imagePreviewUrl: null,
          Wrnining: false,
          url: '',
          loading: 0
        });
      })
      .catch(error => {
        //----------------------------------------- vew the Error Message ------------------------------------//
        console.log(error);
        this.setState({
          Wrnining: true,
          WrniningMessage: error.response.data
        });
      });
  };

  DeleteTopic() {
    this.setState({
      Wrnining: true
    });
  }

  render() {
    if (this.state.editionMode) {
      return (
        <table id={this.state.data['TopicID']} className="bottomBorder">
          <tr> {this.state.Wrnining ? this.state.WrniningMessage : null}</tr>
          <tr>
            <td>
              <div>
                <Image src={this.state.data['Icon']} size="mini" rounded />
                <label>
                  <span className=" glyphicon glyphicon-pencil   imageUploadingSpan"></span>

                  <FileUploader
                    hidden
                    accept="image/*"
                    name="image"
                    storageRef={firebase.storage().ref()}
                    onUploadStart={this.handelloadStart.bind(this)}
                    onUploadSuccess={this.handelSucces.bind(this)}
                    onProgress={this.inPrograss.bind(this)}
                  ></FileUploader>
                  {this.state.loading ? this.state.loading : null}
                </label>
              </div>
            </td>
            <td className="margin">
              <Input
                icon="address card"
                iconPosition="left"
                style={{ maxWidth: '140px' }}
                type="text"
                placeholder={this.state.data['Title']}
                onChange={e => {
                  this.setState({
                    Title: e.target.value
                  });
                }}
              />
              {/* <input
                style={{ maxWidth: '120px' }}
                type="text"
                aria-label="Small"
                placeholder={this.state.data['Title']}
                onChange={e => {
                  this.setState({
                    Title: e.target.value
                  });
                }}
              ></input> */}
            </td>
            <td>
              <tr>
                <Button.Group basic size="small">
                  <Button
                    icon="save"
                    onClick={this.onClickHandler.bind(this)}
                  />
                </Button.Group>
              </tr>

              <tr>
                <Button.Group basic size="small">
                  <Button
                    icon="cancel"
                    onClick={e => {
                      this.setState({
                        editionMode: false
                      });
                    }}
                  />
                </Button.Group>
              </tr>
            </td>
          </tr>
        </table>
      );
    } else {
      return (
        <table id={this.state.data['TopicID']} className="bottomBorder">
          <tr>
            <td class="margin   unclickibl">
              <Image src={this.state.data['Icon']} size="mini" rounded />
            </td>
            <td
              class=" menuItem_Title  unclickibl "
              style={{ textAlign: 'center' }}
            >
              {this.state.data['Title']}
            </td>
            <td className="margin">
              <tr>
                <Button.Group basic size="small">
                  <Button icon="edit" onClick={this.editTopic.bind(this)} />
                </Button.Group>
              </tr>
              <tr>
                <Button.Group basic size="small">
                  <Button
                    icon="delete"
                    onClick={e => {
                      this.setState({
                        Wrnining: true
                      });
                    }}
                  />
                </Button.Group>
              </tr>
            </td>
          </tr>
          {this.state.Wrnining ? (
            <tr>
              <td colspan="3" style={{ maxWidth: '200px' }}>
                <div
                  className="row ItemParagraph"
                  style={{ width: '100%', wordBreak: 'break-word' }}
                >
                  {/* -----------------     Warning Message go' here  ---------------------- */}
                  this Operation will couase to Delete all refrence of the
                  Topic.Are you sure you want to delete it ?
                  <div className=" row  ">
                    <button
                      class="btn btn-outline-danger btn-sm btn-sm-cust "
                      onClick={this.oktoDeleteTopic.bind(this)}
                    >
                      OK
                    </button>

                    <button
                      class="btn btn-outline-primary btn-sm btn-sm-cust"
                      onClick={e => {
                        this.setState({ Wrnining: !this.state.Wrnining });
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ) : null}
        </table>
      );
    }
  }
}

export default ArticlesList;

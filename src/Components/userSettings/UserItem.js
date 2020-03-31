import React from 'react';
import '../../css/component.css';
import '../../css/buttonStyles.css';
import axios from 'axios';
import FileUploader from 'react-firebase-file-uploader';
import firebase from 'firebase';
import config from '../../config.json';
import { error } from 'mammoth/lib/results';

class UserItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.user,
      edit: false,
      password: '',
      Email: '',
      userName: '',
      url: '',
      erroMessage: '',
      error: false
    };
  }
  //------------------------------- Handeling the uploading Operation for Firbase -------------------------------//
  handelloadStart(e) {
    console.log('hhhhhhhhhhhhhhhhh');
    this.setState({
      loading: 1
    });
  }

  onProgress(e) {
    this.setState({
      loading: e
    });
  }
  handelSucces(e) {
    // console.log(firebase.storage);
    firebase
      .storage()
      .ref()
      .child(e)
      .getDownloadURL()
      .then(url => {
        console.log(url, ' url user item');
        this.setState({ url: url });
      });
  }

  //---------------------------------------------------------- Deleting A user ---------------------------------------------------------------//
  DeletUser() {
    axios
      .post(config[0].server + 'User/deleteUser', {
        userID: [this.props.user['userID']],
        userName: this.props.user['userName']
      })
      .then(result => {
        this.setState(
          {
            error: false,
            erroMessage: '',
            edit: false
          },
          () => {
            this.props.getallUsers();
          }
        );
      })
      .catch(error => {
        this.setState(
          {
            erroMessage: error.response.data,
            error: true
          },
          () => {
            this.props.showError(this.state.erroMessage);
          }
        );
      });
  }
  //--------------------------------------------------- A func to Upadte the User Data -------------------------------------------------------//
  UpdateUser() {
    var obj = {};
    //------------------------------------------ evaluate the User Data for Update Operation --------------------------------------------------//
    obj.userID = this.props.user['userID'];
    obj.userName = this.state.userName || this.props.user['userName'];
    obj.Email = this.state.Email || this.props.user['Email'];
    obj.password = this.state.password || this.props.user['password'];
    obj.Image =
      this.state.url ||
      this.props.user['Image'] ||
      'https://firebasestorage.googleapis.com/v0/b/ncdp-270519.appspot.com/o/circle-png-circle-icon-1600.png?alt=media&token=a9f1a9fa-08e8-40a8-8c55-a8e4a3bcb005';

    //--------------------------------- send data to server ---------------------------------------//
    axios
      .post(config[0].server + 'User/UpdateUser', obj)
      .then(result => {
        this.setState(
          {
            error: false,
            erroMessage: '',
            edit: false
          },
          () => {
            this.props.getallUsers();
          }
        );
      })
      .catch(error => {
        this.setState(
          {
            erroMessage: error.response.data,
            error: true
          },
          () => {
            this.props.showError(this.state.erroMessage);
          }
        );
      });
  }

  render() {
    //------------------------------ if its not edition Mode return reqular rows ------------------------//
    if (!this.state.edit) {
      return (
        <tr>
          <td>{this.props.user['userName']}</td>
          <td>{this.props.user['Email']}</td>

          <td>
            <input
              id="userNameUpdate"
              type="image"
              style={{ maxWidth: '30px', maxHeight: '30px' }}
              src={
                this.props.user['Image'] ||
                'https://firebasestorage.googleapis.com/v0/b/ncdp-270519.appspot.com/o/circle-png-circle-icon-1600.png?alt=media&token=a9f1a9fa-08e8-40a8-8c55-a8e4a3bcb005'
              }
            ></input>
          </td>
          <td>
            <span
              className=" glyphicon glyphicon-pencil  ItemIcons "
              onClick={e => {
                this.setState({ edit: true });
              }}
            ></span>
          </td>
          <td>
            <span
              class="glyphicon glyphicon-remove-circle ItemIcons"
              onClick={this.DeletUser.bind(this)}
            ></span>
          </td>
        </tr>
      );
    } else if (this.state.edit) {
      //------------------------------ if its  edition Mode return editibale  rows ------------------------//
      return (
        <tr>
          <td>
            <input
              id="userNameEmailUpdate"
              class="w3-input"
              type="text"
              placeholder={this.state.user['userName']}
              onChange={e => {
                this.state.userName = e.target.value;
              }}
            ></input>
          </td>
          <td>
            <input
              id="userEmailUpdate"
              class="w3-input"
              type="text"
              placeholder={this.props.user['Email']}
              onChange={e => {
                this.state.Email = e.target.value;
              }}
            ></input>
          </td>

          <td>
            <div className="col">
              <input
                type="image"
                style={{ maxWidth: '30px', maxHeight: '30px' }}
                src={
                  this.state.url ||
                  this.props.user['Image'] ||
                  'https://firebasestorage.googleapis.com/v0/b/ncdp-270519.appspot.com/o/circle-png-circle-icon-1600.png?alt=media&token=a9f1a9fa-08e8-40a8-8c55-a8e4a3bcb005'
                }
              ></input>
            </div>
          </td>
          <td>
            <div className="col">
              <label>
                <span className=" glyphicon glyphicon-upload	ItemIcons  "></span>
                <div className="col">
                  {this.state.loading ? this.state.loading : null}
                </div>
                <FileUploader
                  hidden
                  accept="image/*"
                  name="image"
                  storageRef={firebase.storage().ref()}
                  onUploadStart={this.handelloadStart.bind(this)}
                  onUploadSuccess={this.handelSucces.bind(this)}
                  onProgress={this.onProgress.bind(this)}
                ></FileUploader>
              </label>
            </div>
          </td>
          <td>
            <span
              className=" glyphicon glyphicon-ok ItemIcons "
              onClick={this.UpdateUser.bind(this)}
            ></span>
          </td>
          <td>
            <span
              class="glyphicon glyphicon-remove-circle ItemIcons "
              onClick={e => {
                this.setState({ edit: false });
              }}
            ></span>
          </td>
        </tr>
      );
    }
  }
}

export default UserItem;

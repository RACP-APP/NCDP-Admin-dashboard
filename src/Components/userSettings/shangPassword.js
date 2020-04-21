import React from 'react';
import '../../css/component.css';
import '../../css/buttonStyles.css';
import config from '../../config.json';
import axios from 'axios';
import FileUploader from 'react-firebase-file-uploader';
import firebase from 'firebase';
import ErrorMessage from '../../Components/ErroeDialog';

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Newpassword: '',
      confirmPassword: '',
      userID: '',
      userName: '',
      aEmail: '',
      url: '',
      oldPassword: '',
      loading: 0,
      ErrorMessage: '',
      oldPasswordHasChanged: false,
      error: false,
      open: false,
    };
  }

  //-------------------------------- Handeling the uploading Operation for Firbase ----------------------------//
  handelloadStart(e) {}

  onProgress(e) {
    this.setState({
      loading: e,
    });
  }
  handelSucces(e) {
    firebase
      .storage()
      .ref()
      .child(e)
      .getDownloadURL()
      .then((url) => {
        console.log(url);
        this.setState({ url: url });
      });
  }

  componentDidMount() {
    this.setState(
      {
        oldPassword: '',
        userID: JSON.parse(localStorage.getItem('user'))['userID'],
        userName: JSON.parse(localStorage.getItem('user'))[
          'userName'
        ].toString(),
        aEmail: JSON.parse(localStorage.getItem('user'))['Email'],
        url: JSON.parse(localStorage.getItem('user'))['Image'],
      },
      () => {
        console.log(
          JSON.parse(localStorage.getItem('user'))['userName'].toString(),
          'username'
        );
      }
    );
  }

  //------------------------------------------- Save User Data ----------------------------------------------//
  saveUser(e) {
    //------------------------------------ all variables to send --------------------------------------------//
    var obj = {};
    obj.userName =
      this.state.userName ||
      JSON.parse(localStorage.getItem('user'))['userName'].toString();
    obj.Email =
      this.state.aEmail || JSON.parse(localStorage.getItem('user'))['Email'];
    obj.Image =
      this.state.url || JSON.parse(localStorage.getItem('user'))['Image'];
    obj.userID =
      this.state.userID || JSON.parse(localStorage.getItem('user'))['userID'];
    console.log(this.state.Newpassword, this.state.confirmPassword);
    obj.password = this.state.oldPassword;
    obj.Newpassword = this.state.Newpassword;

    //------------- if old password field is empty or the email field is empty then do not update-----------//
    if (this.state.oldPassword === '' || this.state.aEmail === '') {
      this.setState({
        ErrorMessage: 'من فضلك أدخل كلمة مرورك ..',
        open: true,
      });
    } else {
      if (this.checkConfirmingPassword()) {
        //---------------------------------------------------------------------------------------------------//
        //-------------------- make a post to the server with all information -------------------------------//
        //---------------------------------------------------------------------------------------------------//

        axios
          .post(config[0].server + 'User/ChangePassword', obj)
          .then((result) => {
            this.setState(
              {
                ErrorMessage: '',
                open: false,
              },
              () => {
                this.props.LogOut();
              }
            );
          })
          .catch((error) => {
            console.log(error.response.data);
            this.setState({
              ErrorMessage: error.response.data,
              open: true,
            });
          });
      }
    }
  }

  //----------------------------------------------------------------------------------------------------//
  //------------------------------ a function to confirm the new Password ------------------------------//
  //----------------------------------------------------------------------------------------------------//
  checkConfirmingPassword() {
    //---------------------- if password is match then return true and hide error ----------------------//
    if (
      this.state.Newpassword.toString().trim() !==
      this.state.confirmPassword.toString().trim()
    ) {
      this.setState({
        error: true,
        ErrorMessage: 'كلمة السر غير متطابقة',
        open: true,
      });
      return false;
      //------------------ if password dose not match then return false and show error ------------------//
    }

    console.log(this.state.Newpassword, this.state.confirmPassword);
    if (this.state.Newpassword === '' && this.state.confirmPassword === '') {
      this.setState({
        error: true,
        ErrorMessage: 'أدخل كلمة مرور صالحة',
        open: true,
      });
      return false;
    }
    this.setState({
      error: false,
      ErrorMessage: '',
      open: false,
    });
    return true;
  }
  render() {
    return (
      <div className=" row" style={{ width: '100%' }}>
        <ErrorMessage
          open={this.state.open}
          ErrorMessage={this.state.ErrorMessage}
        />
        <br></br>
        <div className="row border">
          <div className="col-3 shangpassword">
            <div className="row">
              <table>
                <tr>
                  <br></br>
                  <div className="row">
                    <input
                      type="image"
                      className="img-thumbnail   "
                      src={
                        this.state.url ||
                        'https://firebasestorage.googleapis.com/v0/b/ncdp-270519.appspot.com/o/closeup-1579990437761-8340.jpg?alt=media&token=6e7f628c-f0a9-4f3a-bad8-be2706549f60'
                      }
                    ></input>
                    <label>
                      <FileUploader
                        hidden
                        accept="image/*"
                        name="image"
                        storageRef={firebase.storage().ref()}
                        onUploadStart={this.handelloadStart.bind(this)}
                        onUploadSuccess={this.handelSucces.bind(this)}
                        onProgress={this.onProgress.bind(this)}
                      ></FileUploader>
                      <span className=" glyphicon glyphicon-upload	 ItemIcons "></span>
                    </label>
                  </div>
                </tr>
                <tr>
                  <div className="row">
                    <span> User Name : </span>
                    {!this.state.userName.toUpperCase() ===
                    'admin'.toUpperCase() ? (
                      <input
                        id="CurrentUserNmae"
                        class="w3-input"
                        type="text"
                        placeholder={this.state.userName}
                        value={this.state.userName}
                        onChange={(e) => {
                          console.log(e.target.value);
                          this.setState({
                            userName: e.target.value,
                          });
                        }}
                      />
                    ) : (
                      <label>{this.state.userName}</label>
                    )}
                  </div>
                </tr>
                <tr>
                  <div className="row">
                    <br></br>
                    <br></br>
                    <div className="col">
                      <span
                        class="glyphicon glyphicon-ok ItemIcons"
                        onClick={this.saveUser.bind(this)}
                      ></span>
                    </div>
                  </div>
                </tr>
              </table>
            </div>
          </div>
          <div className="col ">
            <br></br>
            <br></br>
            <div className="row" align="right">
              <br></br>
              <div className="col-3">
                <span>الأيميل :</span>
              </div>
              <div className="col-8">
                <input
                  class="w3-input"
                  id="NewEmail"
                  type="text"
                  disabled
                  placeholder={this.state.aEmail}
                  value={this.state.aEmail}
                  onChange={(e) => {
                    console.log(e.target.value);
                    this.setState({
                      aEmail: e.target.value,
                    });
                  }}
                ></input>
              </div>
            </div>
            <div className="row" align="right">
              <br></br>
              <div className="col-3">
                <span>كلمة المرور القديمه :</span>
              </div>
              <div className="col-8">
                <input
                  class="w3-input"
                  id="oldpassword"
                  type="password"
                  placeholder={this.state.oldPassword}
                  onChange={(e) => {
                    console.log(this.state.oldPassword);
                    this.setState({
                      oldPassword: e.target.value,
                      oldPasswordHasChanged: true,
                    });
                  }}
                ></input>
              </div>
            </div>

            <br></br>
            <div className="row" align="right">
              <div className="col-3">
                <span>كلمة المرور الجديده :</span>
              </div>
              <div className="col-8">
                <input
                  class="w3-input"
                  id="newPASSWORD"
                  type="password"
                  placeholder="كلمة المرور الجديده"
                  onChange={(e) => {
                    this.setState({
                      Newpassword: e.target.value,
                    });
                  }}
                ></input>
              </div>
            </div>
            <br></br>
            <div className="row" align="right">
              <div className="col-3">
                <span>تأكيد كلمة المرور : </span>
              </div>
              <div className="col-8">
                <input
                  class="w3-input"
                  id="ConfirmPassword"
                  type="password"
                  placeholder="تأكيد كلمة المرور"
                  onChange={(e) => {
                    this.setState({
                      confirmPassword: e.target.value,
                    });
                  }}
                ></input>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ChangePassword;

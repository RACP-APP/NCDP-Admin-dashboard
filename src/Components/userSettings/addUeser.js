import React from 'react';
import '../../css/component.css';
import '../../css/buttonStyles.css';
import config from '../../config.json';
import axios from 'axios';
import FileUploader from 'react-firebase-file-uploader';
import firebase from 'firebase';

class AddUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addUser: false,
      password: '',
      userName: '',
      aEmail: '',
      url: '',
      loading: 0,
      HasError: false,
      ErrorMessage: 'عنوان البريد الإلكتروني غير صالح',
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
    // console.log(firebase.storage);
    firebase
      .storage()
      .ref()
      .child(e)
      .getDownloadURL()
      .then((url) => {
        console.log(url);
        this.setState({ url });
      });
  }

  //--------------------------------------------------------------------------------//
  //------------------ a function to validate the Email Adress ---------------------//
  //--------------------------------------------------------------------------------//
  validate(email) {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return expression.test(String(email).toLowerCase());
  }

  //--------------------------------------------------------------------------------//
  //-------------- a function to get the email form htnl if its valied -------------//
  //--------------------------------------------------------------------------------//
  validateEmaile(e) {
    //------------- if the Email is not Valid update state of alrest Message and error ----------------//
    if (!this.validate(e.target.value)) {
      this.setState({
        HasError: true,
        ErrorMessage: 'عنوان البريد الإلكتروني غير صالح',
      });
    } //-------------------- if the Email is Valid then Save the email in the state --------------------//
    else {
      this.setState({
        aEmail: e.target.value,
        HasError: false,
        ErrorMessage: '',
      });
    }
  }
  //-------------------------------------------------------------------------------------------------------------//
  //-------------------------------------------- a function to add a user to dataBase ---------------------------//
  //-------------------------------------------------------------------------------------------------------------//
  InsertUser() {
    console.log(this.state.aEmail, this.state.userName);
    //------------------------------------------ send data to database ------------------------------------------//
    if (
      this.state.aEmail === '' ||
      this.state.userName === '' ||
      this.state.password === ''
    ) {
      //---------------------- if the user didn't insert username or password or email dont insert ------------//
      this.setState({
        HasError: true,
        ErrorMessage: ' يرجى إدخال اسم مستخدم وبريد إلكتروني صالحين',
      });
    } else {
      //-------------------------- if all information is correct goe to insertion operation -------------------//
      this.setState(
        {
          HasError: false,
          ErrorMessage: ' ',
        },
        () => {
          console.log(this.state.url, 'url');
          //-------------------------------------------------------------------------------------------------//
          axios
            .post(config[0].server + 'User/AddUser', {
              userName: this.state.userName,
              Email: this.state.aEmail,
              Image: this.state.url,
              password: this.state.password,
            })
            .then((result) => {
              //--------------------------- if the operation run correctly then set the state --------------//
              this.setState(
                {
                  addUser: false,
                  password: '',
                  userName: '',
                  aEmail: '',
                  url: '',
                  loading: 0,
                  HasError: false,
                  ErrorMessage: '',
                },
                () => {
                  //--------------- after that call the parent function to update the View ----------------//
                  this.props.getallUsers();
                }
              );
            })
            .catch((error) => {
              //------------------------------- if the post operation failed then show the error ----------//
              this.setState({
                HasError: true,
                ErrorMessage: error.response.data,
              });
            });
        }
      );
    }
  }
  render() {
    return (
      <div id="addUser" dir="rtl">
        <table class="table">
          <thead class="thead-dark">
            <tr>
              <th scope="col">اسم المستخدم</th>
              <th scope="col">البريد الإلكتروني</th>
              <th scope="col">رمز الدخول</th>
              <th scope="col">الصوره</th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {/*  ---------------------------------------- Username --------------------------------------- */}
                <input
                  class="w3-input"
                  type="text"
                  placeholder="الرجاء ادخال اسم المستخدم هنا "
                  onChange={(e) => {
                    this.state.userName = e.target.value;
                    console.log(this.state.userName);
                  }}
                ></input>
              </td>
              <td>
                {/*  ---------------------------------- Email --------------------------------------------- */}

                <input
                  class="w3-input"
                  type="text"
                  placeholder="الرجاء إدخال البريد الإلكتروني هنا"
                  onChange={this.validateEmaile.bind(this)}
                ></input>
              </td>
              <td>
                {/*  --------------------------------------- Password ------------------------------------- */}
                <input
                  class="w3-input"
                  type="password"
                  placeholder="الرجاء إدخال كلمة المرور هنا"
                  onChange={(e) => {
                    this.state.password = e.target.value;
                    console.log(this.state.password);
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
                      'https://firebasestorage.googleapis.com/v0/b/ncdp-270519.appspot.com/o/circle-png-circle-icon-1600.png?alt=media&token=a9f1a9fa-08e8-40a8-8c55-a8e4a3bcb005'
                    }
                  ></input>
                </div>
              </td>
              <td>
                {/*  ------------------------------------ uplaod Image ----------------------------------------- */}

                <div className="row">
                  <div className="col">
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
                  <div
                    className="col"
                    style={{ position: 'static', top: '50%' }}
                  >
                    {this.state.loading ? this.state.loading : null}
                  </div>
                </div>
              </td>
              <td>
                <span
                  class="glyphicon glyphicon-remove-circle ItemIcons "
                  onClick={(e) => {
                    this.props.closeAdd();
                  }}
                ></span>
              </td>
              <td>
                {/* ---------------------------- Add user Icoms ----------------------------------------- */}
                <span
                  className=" glyphicon glyphicon-ok ItemIcons "
                  onClick={this.InsertUser.bind(this)}
                ></span>
              </td>
            </tr>
            <tr>
              <span>{this.state.ErrorMessage}</span>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

export default AddUser;

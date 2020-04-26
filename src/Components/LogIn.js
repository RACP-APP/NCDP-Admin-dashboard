import React from 'react';
import '../css/component.css';
import axios from 'axios';
import config from '../config.json';
import { Grid, Button, Divider, Form, Segment, Icon } from 'semantic-ui-react';

class LogIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: '',
      password: '',
      isValidEmail: false,
      HasError: false,
      ErrorMessage: '',
    };
    this.validateEmaile = this.validateEmaile.bind(this);
    this.LoginFun = this.LoginFun.bind(this);
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
        Email: e.target.value,
        isValidEmail: true,
        ErrorMessage: '',
        HasError: false,
      });
    }
  }

  //---------------------------------------------------------------------------------------//
  //---------Login Operation If Every Thing Is OK and the fields is not Empty--------------//
  //---------------------------------------------------------------------------------------//
  LoginFun(e) {
    if (
      !this.state.HasError &&
      this.state.Email !== '' &&
      this.state.password !== ''
    ) {
      axios
        .post(config[0].server + 'User/Login', {
          Email: this.state.Email,
          password: this.state.password,
        })
        .then((result) => {
          if (result.data.length === 0) {
            this.setState({
              ErrorMessage:
                'اسم المستخدم أو كلمة المرور غير صحيحة ، يرجى المحاولة مرة أخرى',
              HasError: true,
            });
          } else {
            console.log(result, 'result.data[0]');
            localStorage.setItem('user', JSON.stringify(result.data[0]));

            this.props.LogeedIn();
          }
        })
        .catch((error) => {
          this.setState({
            ErrorMessage: error,
            error: true,
          });
          console.log(error);
        });

      //---------- if there is no Errors in the page make a request ----------//
      console.log('no Errors');
    } else {
      this.setState({
        ErrorMessage:
          'اسم المستخدم أو كلمة المرور غير صحيحة ، يرجى المحاولة مرة أخرى',
        HasError: true,
      });
    }
  }

  render() {
    return (
      <div className="container loouncontainer rowCenter">
        <div className="row" style={{ maxWidth: '600px' }}>
          <Segment color="blue" raised>
            <h5 className="card-title">مرحبًا بك في لوحة تحكم NCDP</h5>
            <Segment placeholder>
              <Grid columns={2} relaxed="very" stackable>
                <Grid.Column>
                  <Form>
                    <Form.Input
                      icon="mail"
                      iconPosition="right"
                      placeholder="email@example.com Or UserName"
                      name="email"
                      onChange={this.validateEmaile.bind(this)}
                    />
                    <Form.Input
                      icon="lock"
                      iconPosition="right"
                      type="password"
                      id="inputPassword"
                      placeholder="Password"
                      name="password"
                      onChange={(e) => {
                        this.setState({
                          password: e.target.value,
                        });
                      }}
                    />

                    {this.state.HasError ? (
                      <div class="alert alert-danger" role="alert">
                        {this.state.ErrorMessage}
                      </div>
                    ) : null}
                    <Button
                      content=" تسجيل الدخول"
                      onClick={this.LoginFun.bind(this)}
                      primary
                    />
                  </Form>
                </Grid.Column>

                <Grid.Column verticalAlign="middle">
                  <input
                    type="image"
                    className="img-row  "
                    src={
                      config[0].logo ||
                      'https://firebasestorage.googleapis.com/v0/b/ncdp-270519.appspot.com/o/closeup-1579990437761-8340.jpg?alt=media&token=6e7f628c-f0a9-4f3a-bad8-be2706549f60'
                    }
                  ></input>
                </Grid.Column>
              </Grid>
              <Divider vertical>
                <Icon
                  name="hand point right"
                  loading
                  circular
                  size="huge"
                ></Icon>
              </Divider>
            </Segment>
          </Segment>
          {/* <div className=" row border">
            <div className="col-4 shangpassword">
              <table>
                <tr>
                  <br></br>
                  <div className="row">
                    <input
                      type="image"
                      className="img-row  "
                      src={
                        config[0].logo ||
                        'https://firebasestorage.googleapis.com/v0/b/ncdp-270519.appspot.com/o/closeup-1579990437761-8340.jpg?alt=media&token=6e7f628c-f0a9-4f3a-bad8-be2706549f60'
                      }
                    ></input>
                  </div>
                </tr>
              </table>
            </div>
            <div className="col">
              <div>
                <div className=" ">
                  <div className="card-body">
                    <h5 className="card-title">مرحبًا بك في لوحة تحكم NCDP</h5>

                    <div className="form-group row">
                      <label for="staticEmail" className="col-sm-5 "></label>
                      <br></br>
                    </div>
                    <div className="form-group row">
                      <label
                        for="staticEmail"
                        className="col-sm-4 col-form-label"
                      >
                        البريد الإلكتروني :
                      </label>
                      <br></br>
                      <div className="col-sm">
                        <input
                          type="text"
                          className="form-control"
                          id="staticEmail"
                          placeholder="email@example.com Or UserName"
                          name="email"
                          onChange={this.validateEmaile.bind(this)}
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <label
                        for="inputPassword"
                        className="col-sm-4 col-form-label"
                      >
                        الرمز الإلكتروني :
                      </label>
                      <div className="col-sm">
                        <input
                          type="password"
                          className="form-control"
                          id="inputPassword"
                          placeholder="Password"
                          name="password"
                          onChange={(e) => {
                            this.setState({
                              password: e.target.value,
                            });
                          }}
                        />
                        <br></br>
                        <br></br>
                        <div className="form-group row">
                          <button
                            type="button"
                            className="btn btn-primary btn-lg btn-block col-sm-9"
                            onClick={this.LoginFun.bind(this)}
                          >
                            قم بتسجيل الدخول إلى CDP
                          </button>
                        </div>
                      </div>
                    </div>
                    {this.state.HasError ? (
                      <div class="alert alert-danger" role="alert">
                        {this.state.ErrorMessage}
                      </div>
                    ) : null}

                    <text name="errorHolder" id="errorHolder"></text>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    );
  }
}

export default LogIn;

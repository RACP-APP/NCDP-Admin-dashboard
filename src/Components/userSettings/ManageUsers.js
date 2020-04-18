import React from 'react';
import '../../css/component.css';
import '../../css/buttonStyles.css';
import config from '../../config.json';
import axios from 'axios';
import User from './UserItem';
import AddUser from './addUeser';
import { TransitionablePortal, Segment, Header, Icon } from 'semantic-ui-react';

class ManagUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Users: [],
      error: false,
      ErrorMessage: '',
      addUser: false,
      password: '',
      userName: '',
      aEmail: '',
      url: '',
      loading: 0,
      HasError: '',
      open: false,
      animation: 'slide down',
      duration: 500,
    };
    this.getallUsers = this.getallUsers.bind(this);
    this.showError = this.showError.bind(this);
    this.closeAdd = this.closeAdd.bind(this);
  }

  //-------------------------------------close the add User Dialog -----------------------------------------//
  closeAdd() {
    this.setState({
      addUser: false,
    });
  }
  //------------------------------------ show the Error from child Item ------------------------------------//
  showError(ErrorMessage) {
    this.setState({
      error: true,
      ErrorMessage: ErrorMessage,
    });
  }

  //------------------------------------ a function to get Our users ----------------------------------------//
  getallUsers() {
    axios
      .post(config[0].server + 'User/getAllUsers')
      .then((result) => {
        this.setState({
          Users: result.data,
          addUser: false,
        });
      })
      .catch((error) => {
        this.setState({
          error: true,
          ErrorMessage: error.response.data,
        });
      });
  }
  componentDidMount() {
    this.getallUsers();
  }
  render() {
    return (
      <div style={{ width: '100%' }}>
        <TransitionablePortal
          open={this.state.open}
          transition={{
            animation: this.state.animation,
            duration: this.state.duration,
          }}
        >
          <Segment
            style={{
              left: '40%',
              position: 'fixed',

              zIndex: 1000,

              top: '2%',

              zIndex: 1000,

              overflow: 'auto',
            }}
          >
            <Header>
              <Icon name="window close" style={{ color: 'red !important' }} />
              Error
            </Header>
            <p>{this.state.ErrorMessage}</p>
          </Segment>
        </TransitionablePortal>
        <div style={{ width: '100%', textAlign: 'center' }}>
          <span
            onClick={() => {
              this.setState({
                addUser: true,
              });
            }}
          >
            لإضافة مستخدم انقر هنا من فضلك
          </span>
          <br></br>
        </div>
        {this.state.error ? (
          <div className="row">{this.state.ErrorMessage}</div>
        ) : null}
        {this.state.addUser ? (
          //---------------------------------------------- add User Start's here ------------------------------------//
          <AddUser
            showError={this.showError.bind(this)}
            getallUsers={this.getallUsers.bind(this)}
            closeAdd={this.closeAdd.bind(this)}
          ></AddUser>
        ) : null}
        <table class="table">
          <thead class="thead-dark">
            <tr>
              <th scope="col">الإسم</th>
              <th scope="col">الإيميل</th>
              <th scope="col">كلمة المرور</th>
              <th scope="col">الصوره</th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {this.state.Users.map((user) => {
              return (
                <User
                  showError={this.showError.bind(this)}
                  getallUsers={this.getallUsers.bind(this)}
                  user={user}
                ></User>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
export default ManagUsers;

import React from 'react';
import '../../css/component.css';
import '../../css/buttonStyles.css';
import config from '../../config.json';
import axios from 'axios';
import User from './UserItem';
import AddUser from './addUeser';

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
      HasError: ''
    };
    this.getallUsers = this.getallUsers.bind(this);
    this.showError = this.showError.bind(this);
    this.closeAdd = this.closeAdd.bind(this);
  }

  //-------------------------------------close the add User Dialog -----------------------------------------//
  closeAdd() {
    this.setState({
      addUser: false
    });
  }
  //------------------------------------ show the Error from child Item ------------------------------------//
  showError(ErrorMessage) {
    this.setState({
      error: true,
      ErrorMessage: ErrorMessage
    });
  }

  //------------------------------------ a function to get Our users ----------------------------------------//
  getallUsers() {
    axios
      .post(config[0].server + 'User/getAllUsers')
      .then(result => {
        console.log(result.data);
        this.setState({
          Users: result.data,
          addUser: false
        });
      })
      .catch(error => {
        console.log(error);
      });
  }
  componentDidMount() {
    this.getallUsers();
  }
  render() {
    return (
      <div>
        <span
          onClick={() => {
            this.setState({
              addUser: true
            });
          }}
        >
          to Add a User Click here Please
        </span>
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
              <th scope="col">Nanme</th>
              <th scope="col">Email</th>
              <th scope="col">Password</th>
              <th scope="col">Image</th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {this.state.Users.map(user => {
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

import React from 'react';
import './App.css';
import LogIn from './Components/LogIn';
import Header from './Components/Header';
import DashBoard from './Components/MainDashBord';
import firebase from 'firebase';
import Footer from './Components/footer';
import TopHeader from './Components/Topheader';
import ImgUploader from './Components/uploadimage';
import AdminSettings from './Components/userSettings/AdminAddUser';
import MainAnalatic from './Components/Analytics/mailAnalyticBoard';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
var firebaseConfig = {
  apiKey: 'AIzaSyAFSTEpX_9R0pzLQ36zBFYxKs19hjxKytA',
  authDomain: 'ncdp-270519.firebaseapp.com',
  databaseURL: 'https://ncdp-270519.firebaseio.com',
  projectId: 'ncdp-270519',
  storageBucket: 'ncdp-270519.appspot.com',
  messagingSenderId: '494635556973',
  appId: '1:494635556973:web:1baf74fc1b51eda1885f64',
  measurementId: 'G-HLNN3MLT5V',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoggetIn: false,
      redirect: '',
    };
    this.logOut = this.logOut.bind(this);
    this.loggedIn = this.loggedIn.bind(this);
  }

  loggedIn() {
    localStorage.setItem('CurrentnavNode', '/');
    this.setState({
      LoggetIn: true,
      redirect: '/',
    });
  }

  logOut() {
    localStorage.setItem('CurrentnavNode', 'LogIn');

    // this.redirectto('LogIn');

    this.setState(
      {
        LoggetIn: false,
        redirect: 'LogIn',
      },
      () => {
        localStorage.clear();
        localStorage.setItem('CurrentnavNode', 'LogIn');
      }
    );
    console.log(
      localStorage.getItem('CurrentnavNode'),
      'CurrentnavNode----------------'
    );
  }

  redirectto(Node) {
    localStorage.setItem('CurrentnavNode', Node);
    console.log(Node, 'kkkk');

    this.setState({
      redirect: Node,
    });
  }
  componentDidMount() {
    if (localStorage.getItem('user')) {
      this.setState(
        {
          LoggetIn: true,
        },
        () => {
          localStorage.setItem('CurrentnavNode', '/');
        }
      );
    } else {
      this.setState(
        {
          LoggetIn: false,
          redirect: 'LogIn',
        },
        () => {
          localStorage.setItem('CurrentnavNode', 'LogIn');
        }
      );
    }
  }

  render() {
    return (
      <div>
        <div className="row">
          <TopHeader></TopHeader>
        </div>
        {this.state.LoggetIn ? (
          <Header
            logOut={this.logOut.bind(this)}
            redirect={this.redirectto.bind(this)}
          ></Header>
        ) : null}
        <div className="row" style={{ float: 'left' }}>
          <Router>
            <Route>
              <Redirect to={localStorage.getItem('CurrentnavNode')}></Redirect>
            </Route>

            <Route exact path="/" component={DashBoard}></Route>
            <Route
              exact
              path="/LogIn"
              render={() => {
                return <LogIn LogeedIn={this.loggedIn.bind(this)}></LogIn>;
              }}
            ></Route>
            <Route
              exact
              path="/userSetting"
              component={() => {
                return <AdminSettings LogOut={this.logOut.bind(this)} />;
              }}
            ></Route>
            <Route
              exact
              path="/Analytics"
              component={() => {
                return <MainAnalatic LogOut={this.logOut.bind(this)} />;
              }}
            ></Route>
          </Router>
        </div>

        {/* <PDfConverter></PDfConverter> */}
        <Footer />
      </div>
    );
    // return <D></D>;
  }
}

export default App;

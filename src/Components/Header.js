import React from 'react';
import $ from 'jquery';
import config from '../config';
import { Link } from 'react-router-dom';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoggetIn: false,
      UserImage: ''
    };
    // this.openNav = this.openNav.bind(this);
  }

  //   getgg(e) {
  //     console.log('hhhhhhhhhhhhhhhhhhhhhhhh');
  //   }
  //   openNav(e) {
  //     console.log('hhhhhhhhhhhhhhhhhhhhhhhh');
  //     document.getElementById('mySidenav').style.width = '250px';
  //     document.getElementById('main').style.marginLeft = '250px';
  //     document.body.style.backgroundColor = 'rgba(0,0,0,0.4)';
  //   }

  /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
  closeNav() {
    document.getElementById('mySidenav').style.width = '0';
    document.getElementById('main').style.marginLeft = '0';
    document.body.style.backgroundColor = 'white';
  }
  componentDidMount() {
    if (localStorage.getItem('user')) {
      this.setState({
        LoggetIn: true,
        UserImage: JSON.parse(localStorage.getItem('user'))['Image']
      });
    } else {
      this.setState({
        LoggetIn: false,
        UserImage: ''
      });
    }
  }

  render() {
    return (
      <div className="navnar  transparentBackground">
        <div id="mySidenav" class="sidenav ">
          <div>
            <div className="row UserSection">
              <img
                className="header_imge"
                alt="Avatar"
                src={JSON.parse(localStorage.getItem('user'))['Image']}
              ></img>
            </div>
            <div className="row ">
              <span className="sidparUserInfo">
                Welcome : {JSON.parse(localStorage.getItem('user'))['userName']}
              </span>
            </div>
          </div>
          <div>
            <a
              href="javascript:void(0)"
              className="closebtn"
              onClick={e => {
                $('#mySidenav').css('width', '0px');
              }}
            >
              &times;
            </a>
          </div>
          <div className="sidepareItem borderTop">
            <a href={config[0].server}>Home</a>
          </div>
          <div className="sidepareItem borderTop">
            <a
              href=""
              onClick={e => {
                this.props.logOut();
              }}
            >
              LogOut
            </a>
          </div>
          {}
          <div className="sidepareItem borderTop">
            {/* <Link to="/"></Link> */}
            <a
              onClick={() => {
                this.props.redirect('userSetting');
              }}
            >
              Setting
            </a>
          </div>
          <div className="sidepareItem borderTop ">
            <a
              onClick={() => {
                this.props.redirect('Analytics');
              }}
            >
              Analytics
            </a>
          </div>
        </div>

        <div className="  infoi transparentBackground">
          <div
            className="navbar-light  main_menu transparentBackground"
            onClick={e => {
              $('.sidenav').css('width', '250px');
            }}
          >
            <span className="	glyphicon glyphicon-menu-hamburger	 menuBatten"></span>
          </div>
        </div>
      </div>
    );
  }
}
export default Header;

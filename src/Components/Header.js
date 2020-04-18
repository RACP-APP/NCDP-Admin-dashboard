import React from 'react';
import $ from 'jquery';
import config from '../config';

import { Menu, Icon, Label, Input, Portal, Button } from 'semantic-ui-react';
class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LoggetIn: false,
      UserImage: '',
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
        UserImage: JSON.parse(localStorage.getItem('user'))['Image'],
      });
    } else {
      this.setState({
        LoggetIn: false,
        UserImage: '',
      });
    }
  }

  render() {
    return (
      <div className="navnar  transparentBackground" dir="rtl">
        <div id="mySidenav" class="sidenav ">
          <div>
            <a
              href="javascript:void(0)"
              className="closebtn"
              onClick={(e) => {
                $('#mySidenav').css('width', '0px');
              }}
            >
              &times;
            </a>
          </div>
          <Menu size="large" pointing vertical style={{ maxWidth: '250px' }}>
            <Menu.Item>
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
                    {JSON.parse(localStorage.getItem('user'))['userName']}:
                    مرحبا
                  </span>
                </div>
              </div>
            </Menu.Item>
            <Menu.Item
              name="inbox"
              // active={activeItem === 'inbox'}
              // onClick={this.handleItemClick}
            >
              <Icon name="home" size="large" />
              <a href={config[0].server}>الصفحة الرئيسيه</a>
            </Menu.Item>

            <Menu.Item
              name="spam"
              // active={activeItem === 'spam'}
              // onClick={this.handleItemClick}
            >
              <Icon name="log out" size="large" />
              <a
                onClick={(e) => {
                  // this.props.redirect('userSetting');
                  this.props.logOut();
                }}
              >
                تسجيل الخروج
              </a>
            </Menu.Item>

            <Menu.Item
              name="updates"
              // active={activeItem === 'updates'}
              // onClick={this.handleItemClick}
            >
              <Icon name="cogs" size="large" />
              <a
                href={config[0].server + 'userSetting'}
                onClick={() => {
                  // this.props.redirect('userSetting');
                }}
              >
                الضبط
              </a>
            </Menu.Item>
            <Menu.Item>
              <Icon name="chart area" size="big" />
              <a
                href={config[0].server + 'Analytics'}
                onClick={() => {
                  localStorage.setItem('CurrentnavNode', 'Analytics');
                  // this.props.redirect('Analytics');
                }}
              >
                إحصائيات
              </a>
            </Menu.Item>
          </Menu>
          {/* <div className="sidepareItem borderTop">
            <a href={config[0].server}>الصفحة الرئيسيه</a>
          </div> */}
          {/* <div className="sidepareItem borderTop">
            <a
              href=""
              onClick={(e) => {
                this.props.logOut();
              }}
            >
              تسجيل الخروج
            </a>
          </div> */}
          {}
          {/* <div className="sidepareItem borderTop">
            {/* <Link to="/"></Link>
            <a
              onClick={() => {
                this.props.redirect('userSetting');
              }}
            >
              الضبط
            </a>
          </div>
          <div className="sidepareItem borderTop ">
            <a
              onClick={() => {
                this.props.redirect('Analytics');
              }}
            >
              إحصائيات
            </a>
          </div> */}
        </div>

        <div className="  infoi transparentBackground">
          <div
            className="navbar-light  main_menu transparentBackground"
            onClick={(e) => {
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

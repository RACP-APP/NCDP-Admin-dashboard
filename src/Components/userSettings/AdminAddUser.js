import React from 'react';
import '../../css/component.css';
import '../../css/buttonStyles.css';
// import config from '../config.json';
import ManagUsers from './ManageUsers';
import ChangePassword from './shangPassword';

class AdminSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addUser: false,
      loading: 0,
      HasError: '',
      ErrorMessage: ''
    };
  }

  LogOut() {
    console.log('fffffffffffffffffffff');
    this.props.LogOut();
  }

  render() {
    return (
      <div className="container">
        <div className="row" style={{ justifyContent: 'left' }}>
          <nav>
            <div class="nav nav-tabs" id="nav-tab" role="tablist">
              {JSON.parse(localStorage.getItem('user'))[
                'userName'
              ].toUpperCase() === 'ADMIN'.toUpperCase() ? (
                <a
                  class="nav-item nav-link active"
                  id="nav-home-tab"
                  data-toggle="tab"
                  href="#nav-home"
                  role="tab"
                  aria-controls="nav-home"
                  aria-selected="true"
                >
                  Manage Users
                </a>
              ) : null}
              <a
                class="nav-item nav-link"
                id="nav-profile-tab"
                data-toggle="tab"
                href="#nav-profile"
                role="tab"
                aria-controls="nav-profile"
                aria-selected="false"
              >
                Shange Password
              </a>
              {/* <a
                class="nav-item nav-link"
                id="nav-contact-tab"
                data-toggle="tab"
                href="#nav-contact"
                role="tab"
                aria-controls="nav-contact"
                aria-selected="false"
              >
                Contact
              </a> */}
            </div>
          </nav>
          <div class="tab-content" id="nav-tabContent">
            <div
              class="tab-pane fade show active"
              id="nav-home"
              role="tabpanel"
              aria-labelledby="nav-home-tab"
            >
              {/* ------------------------------------------- Users and Manage them ------------------------------------ */}
              <br></br>
              <br></br>
              <p>
                Dear Admin Note that if you changed the setting of the users
                they will have no longer be able to sign in to the dash bord
                tell you send them an email will all required information
              </p>
              <br></br>

              {/* ------------------------------------- end of the add User ---------------------------------------- */}
              <ManagUsers></ManagUsers>
            </div>
            <div
              class="tab-pane fade"
              id="nav-profile"
              role="tabpanel"
              aria-labelledby="nav-profile-tab"
            >
              <br></br>
              <br></br>
              <p>
                Welwcon : {JSON.parse(localStorage.getItem('user'))['userName']}{' '}
                Fell Free to use NCDP Manage Accout to modify your Setting ,if
                you changed Your Password it will be direclty send to your
                Email.
              </p>
              <br></br>

              <ChangePassword LogOut={this.LogOut.bind(this)}></ChangePassword>
            </div>
            {/* <div
              class="tab-pane fade"
              id="nav-contact"
              role="tabpanel"
              aria-labelledby="nav-contact-tab"
            >
              Et et consectetur ipsum labore excepteur est proident excepteur ad
              velit occaecat qui minim occaecat veniam. Fugiat veniam incididunt
              anim aliqua enim pariatur veniam sunt est aute sit dolor anim.
              Velit non irure adipisicing aliqua ullamco irure incididunt irure
              non esse consectetur nostrud minim non minim occaecat. Amet duis
              do nisi duis veniam non est eiusmod tempor incididunt tempor dolor
              ipsum in qui sit. Exercitation mollit sit culpa nisi culpa non
              adipisicing reprehenderit do dolore. Duis reprehenderit occaecat
              anim ullamco ad duis occaecat ex.
            </div> */}
          </div>
        </div>
      </div>
    );
  }
}

export default AdminSettings;
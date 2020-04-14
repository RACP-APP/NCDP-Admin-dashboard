import React from 'react';
import '../../css/component.css';
import '../../css/buttonStyles.css';
// import config from '../config.json';
import ManagUsers from './ManageUsers';
import ChangePassword from './shangPassword';
import SocialItems from './ManageSocialeIcons';

class AdminSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addUser: false,
      loading: 0,
      HasError: '',
      ErrorMessage: '',
    };
  }

  LogOut() {
    this.props.LogOut();
  }

  render() {
    return (
      <div className="container" dir="rtl">
        <div className="row" style={{ justifyContent: 'right' }}>
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
                  ادارة المستخدمين
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
                تغيير كلمة المرور
              </a>
              <a
                class="nav-item nav-link"
                id="nav-contact-tab"
                data-toggle="tab"
                href="#nav-contact"
                role="tab"
                aria-controls="nav-contact"
                aria-selected="false"
              >
                العناصر الاجتماعية
              </a>
            </div>
          </nav>
          <div class="tab-content" id="nav-tabContent">
            <div
              dir="rtl"
              class="tab-pane fade show active in"
              id="nav-home"
              role="tabpanel"
              aria-labelledby="nav-home-tab"
            >
              {/* ------------------------------------------- Users and Manage them ------------------------------------ */}
              <br></br>
              <br></br>
              <p>
                لاحظ المشرف الأعزاء أنه إذا قمت بتغيير إعداد المستخدمين لن
                يتمكنوا بعد الآن من تسجيل الدخول إلى لوحة الشرطة اقول لكم ارسال
                بريد الكتروني لهم كل المعلومات المطلوبة
              </p>
              <br></br>

              {/* ------------------------------------- end of the add User ---------------------------------------- */}
              <ManagUsers></ManagUsers>
            </div>
            <div
              dir="rtl"
              class="tab-pane fade"
              id="nav-profile"
              role="tabpanel"
              aria-labelledby="nav-profile-tab"
            >
              <br></br>
              <br></br>
              <p>
                أهلا : {JSON.parse(localStorage.getItem('user'))['userName']} لا
                تتردد في استخدام NCDP Manage Account لتعديل إعدادك ، إذا قمت
                بتغيير كلمة المرور الخاصة بك ، فسيتم إرسالها مباشرة إلى بريدك
                الإلكتروني.
              </p>
              <br></br>

              <ChangePassword LogOut={this.LogOut.bind(this)}></ChangePassword>
            </div>

            {/* --------------------------------------- Sosial items starts here ----------------------------- */}

            <div
              dir="rtl"
              class="tab-pane fade"
              id="nav-contact"
              role="tabpanel"
              aria-labelledby="nav-contact-tab"
            >
              <br></br>
              <br></br>
              <p>
                اهلا : {JSON.parse(localStorage.getItem('user'))['userName']} لا
                تتردد في استخدام حساب إدارة NCDP لتعديل الإعدادات ، إذا لقد قمت
                بتغيير أيقونات الموقع الاجتماعية سوف ينعكس هذا التغيير على موقع
                الويب الخاص بك.
              </p>
              <br></br>
              <SocialItems></SocialItems>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminSettings;

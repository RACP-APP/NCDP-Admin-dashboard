import React from 'react';
import config from '../config';
import {
  Menu,
  Icon,
  Popup,
  Segment,
  Portal,
  Header,
  Button,
} from 'semantic-ui-react';
import axios from 'axios';
class TopHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = { open: false, Message: '', error: false, title: '' };
  }

  sendTheNewNoticication() {
    if (localStorage.getItem('ContentUpdate') === null) {
      this.setState({
        open: true,
        Message: 'لا يوجد اي تغيير على المحتوى .. لا يمكن ارسال اشعار جديد',
        title: ' لم يتم الإرسال ',
        error: false,
      });

      console.log(
        'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',
        " .get(config[0].server + 'sendNotification')"
      );
    } else {
      axios
        .get(config[0].server + 'sendNotification')
        .then((result) => {
          console.log(result.data);
          this.setState({
            open: true,
            Message: result.data,
            error: false,
            title: 'نجاح العمليه',
          });
        })
        .catch((error) => {
          this.setState({
            open: true,
            title: ' خطأ بالإرسال',
            Message: error.response.data,
            error: true,
          });
        });
    }
  }
  handleOpen = () => this.setState({ open: true });
  handleClose = () => this.setState({ open: false });

  render() {
    return (
      <div className="Mainheader " style={{ left: '20px' }}>
        <Menu color={'black'} inverted icon="labeled">
          <Menu.Item>
            <div style={{ minWidth: '30px', minHeight: '40px' }}></div>
            {/* <img
              style={{ borderRadius: '20px' }}
              src={
                JSON.parse(localStorage.getItem('user'))['Image'] ||
                'https://react.semantic-ui.com/logo.png'
              }
            /> */}
          </Menu.Item>

          <Menu.Item
            name="features"
            // active={activeItem === 'features'}
            onClick={() => {
              localStorage.setItem('CurrentnavNode', '/');
              localStorage.setItem('CurrentNav', 'Model');
              localStorage.setItem('navMap', JSON.stringify(['عارض النماذج']));
            }}
          >
            <a href={config[0].server}>
              <Popup
                content="الصفحة الرئيسيه "
                trigger={<Icon name="home" size="large" />}
              />
            </a>
          </Menu.Item>

          <Menu.Item
            name="Notification"
            // active={activeItem === 'testimonials'}
            onClick={this.sendTheNewNoticication.bind(this)}
          >
            <a>
              <Popup
                content="لارسال اشعار بالمحتوى الجديد اضغط هنا"
                trigger={<Icon name="bell" size="large" />}
              />
            </a>
            {/* Send Notification */}
          </Menu.Item>
        </Menu>
        <Portal onClose={this.handleClose} open={this.state.open}>
          <Segment
            style={{
              left: '40%',
              position: 'fixed',
              top: '10%',
              zIndex: 1000,
            }}
          >
            <Header>{this.state.title}</Header>
            <p>{this.state.Message}</p>
            <p>
              يمكنك اغلاق الاشعار بالضغط على زر الإغلاق او الضغط اي مكان خارج
              اطار الأشعار
            </p>

            <Button
              content="إغلاق"
              negative
              onClick={this.handleClose.bind(this)}
            />
          </Segment>
        </Portal>
      </div>
    );
  }
}

export default TopHeader;

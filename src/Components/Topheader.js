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
    this.state = {
      open: false,
      Message: '',
      error: false,
      title: '',
      counter: this.props.counter,
    };
  }

  updateNotificationCount(counter) {
    this.setState({
      counter: counter,
    });
  }

  sendTheNewNoticication() {
    axios
      .get(config[0].server + 'Articles/getNotificationCount')
      .then((result) => {
        if (
          result === null ||
          result.data === null ||
          result.data.count === 0
        ) {
          this.setState({
            open: true,
            Message: 'لا يوجد اي تغيير على المحتوى .. لا يمكن ارسال اشعار جديد',
            title: ' لم يتم الإرسال ',
            error: false,
            counter: result.data.count,
          });
        } else {
          axios
            .get(config[0].server + 'sendNotification')
            .then((result) => {
              this.setState(
                {
                  Message: result.data,
                  error: false,
                  title: 'نجاح العمليه',
                },
                () => {
                  //----------------------------------------------- here we need to reset the notification counter --------------------------------------//
                  axios
                    .get(config[0].server + 'Articles/ResetNotificationCount')
                    .then((result) => {
                      this.setState({
                        open: true,
                        counter: 0,
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
              );
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
      })
      .catch((error) => {
        this.setState({
          open: true,
          title: ' خطأ بالإرسال',
          Message: error.response.data,
          error: true,
        });
      });

    // if (localStorage.getItem('ContentUpdate') === null) {
    //   this.setState({
    //     open: true,
    //     Message: 'لا يوجد اي تغيير على المحتوى .. لا يمكن ارسال اشعار جديد',
    //     title: ' لم يتم الإرسال ',
    //     error: false,
    //   });

    //   console.log(
    //     'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh',
    //     " .get(config[0].server + 'sendNotification')"
    //   );
    // } else {
    //   axios
    //     .get(config[0].server + 'sendNotification')
    //     .then((result) => {
    //       console.log(result.data);
    //       this.setState({
    //         open: true,
    //         Message: result.data,
    //         error: false,
    //         title: 'نجاح العمليه',
    //       });
    //     })
    //     .catch((error) => {
    //       this.setState({
    //         open: true,
    //         title: ' خطأ بالإرسال',
    //         Message: error.response.data,
    //         error: true,
    //       });
    //     });
    // }
  }
  handleOpen = () => this.setState({ open: true });
  handleClose = () => this.setState({ open: false });

  componentWillReceiveProps(nextProps) {
    console.log(
      nextProps,
      '------------------------',
      nextProps.counter,
      this.props.counter
    );

    this.setState({
      counter: nextProps.counter,
    });
  }
  componentDidMount() {
    axios
      .get(config[0].server + 'Articles/getNotificationCount')
      .then((result) => {
        console.log(result.data.count + 'counter --------------');
        this.setState({ counter: result.data.count });
      })
      .catch((error) => {
        console.log('error');
      });
  }
  render() {
    return (
      <div className=" " style={{ left: '20px' }}>
        {this.props.loggedIn ? (
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
                localStorage.setItem(
                  'navMap',
                  JSON.stringify(['عارض النماذج'])
                );
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
                  content={`لديك ${this.state.counter} اشعارات . لارسال الإشعرات الجديده اضغط هنا `}
                  trigger={<Icon name="bell" size="large" />}
                />
                <label
                  style={{
                    position: 'absolute',
                    left: '50%',
                    top: 4,
                    backgroundColor: 'red',
                  }}
                >
                  {this.state.counter}
                </label>
              </a>
              {/* Send Notification */}
            </Menu.Item>
          </Menu>
        ) : null}
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

import React from 'react';
import '../../css/component.css';
import '../../css/buttonStyles.css';
import io from 'socket.io';
import socketIOClient from 'socket.io-client';
import { Button, Header, Image, Modal, Progress } from 'semantic-ui-react';

var FReader;
var Name;
const ENDPOINT = 'http://localhost:3000/';
var SelectedFile;
var socket;
var that;

class UploadingItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      io: io.conn,
      response: 'rrrrrrrrrr',
      file: null,
      name: '',
      uploaded: 0,
      SelectedFile: null,
      isUploading: false,
      open: false,
      accept:
        this.props.accept ||
        '.WEBM,  .MPEG,  .MPV, .OGG, .MP4 ,.M4P, .M4V ,.MOV,.AVCHD  ',
    };
  }

  
  returnTheLink(link) {
    console.log(that.props.type);
    if (that.props.type === 'v') {
      that.props.returnTheLink(link);
    } else {
      that.props.returnTheLinkforAdio(link);
    }
  }
  componentDidMount() {
    console.log(
      this.props.returnTheLink,
      '000000000000000000000000000000000000000000'
    );
    that = this;
    socket = socketIOClient(ENDPOINT, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ['websocket'],
    });

    // on reconnection, reset the transports option, as the Websocket
    // connection may have failed (caused by proxy, firewall, browser, ...)
    socket.on('reconnect_attempt', () => {
      // socket.io.opts.transports = ['polling', 'websocket'];
      socket.emit('reconnect', that.state.data);
    });
    //----------------------------------------------------Socket.io on Error ----------------------------------------------------------//
    socket.on('error', function (data) {
      console.log('an Error Accured');
      var Content = 'Error';

      document.getElementById('UploadArea').innerHTML = Content;

      // document.getElementById('Restart').addEventListener('click', Refresh);
    });

    var Path = 'http://localhost:3000//public/uploads';
    //-----------------------------------------------------Socket.io Disconnected from Client Side --------------------------------------//
    socket.on('disconnect', () => {
      console.log('disconnected from client');
    });
    //------------------------------------------------------- Socket.io Done Event -------------------------------------------------------//
    socket.on('Done', function (data) {
      var Content = 'Video Successfully Uploaded !!';
      document.getElementById('UploadArea').innerHTML = Content;
      that.setState({ uploaded: 100 }, () => {
        that.returnTheLink(that.state.SelectedFile.name);
      });
      // document.getElementById('Restart').addEventListener('click', Refresh);
    });

    //------------------------------------------- a Function to Update the Upload % At the Dom -------------------------------------------//
    var UpdateBar = function (percent) {
      document.getElementById('ProgressBar').style.width = percent + '%';
      document.getElementById('percent').innerHTML =
        Math.round(percent * 100) / 100 + '%';
      var MBDone = Math.round(
        ((percent / 100.0) * SelectedFile.size) / 1048576
      );
      that.setState({ uploaded: Math.round(percent * 100) / 100 }, () => {
        document.getElementById('MB').innerHTML = MBDone;
      });
    };

    //----------------------- An io.soket Event to Create Block of Date from the Large file if the file is big ---------------------------//
    socket.on('MoreData', function (data) {
      this.setState({ data: data });
      UpdateBar(data['Percent']);
      var Place = data['Place'] * 524288; //The Next Blocks Starting Position
      var NewFile = Blob; //The Variable that will hold the new Block of Data
      if (that.state.SelectedFile.webkitSlice) {
        NewFile = SelectedFile.webkitSlice(
          Place,
          Place + Math.min(524288, that.state.SelectedFile.size - data['Place'])
        );
      } else if (that.state.SelectedFile.slice) {
        NewFile = SelectedFile.slice(
          Place,
          Place + Math.min(524288, that.state.SelectedFile.size - data['Place'])
        );
      } else if (that.state.SelectedFile.mozSlice) {
        NewFile = that.state.SelectedFile.mozSlice(
          Place,
          Place + Math.min(524288, that.state.SelectedFile.size - data['Place'])
        );
      }
      //------------------ after creating the block of data we call the filereader stream to uplad the block ---------------------------//
      FReader.readAsBinaryString(NewFile);
    });
  }
  onClick(evnt) {
    if (document.getElementById('FileBox').value != '') {
      FReader = new FileReader();
      Name = document.getElementById('NameBox').value;
      var Content =
        "<span id='NameArea'>Uploading " +
        that.state.SelectedFile.name +
        ' as ' +
        Name +
        '</span>';
      Content +=
        '<div id="ProgressContainer"><div id="ProgressBar"></div></div><span id="percent">0%</span>';
      Content +=
        "<span id='Uploaded'> - <span id='MB'>0</span>/" +
        Math.round(that.state.SelectedFile.size / 1048576) +
        'MB</span>';
      document.getElementById('UploadArea').innerHTML = Content;
      FReader.onload = function (evnt) {
        socket.emit('Upload', { Name: Name, Data: evnt.target.result });
      };
      that.setState({ isUploading: true }, () => {
        socket.emit(
          'Start',
          {
            Name: Name,
            Size: that.state.SelectedFile.size,
          },
          () => {
            console.log(that.state.isUploading, 'start Uploading');
          }
        );
      });
    } else {
      alert('Please Select A File');
    }
  }

  setThName(e) {
    console.log(e.target.value);
  }
  close(e) {
    console.log('colosing');
    this.setState({
      open: false,
    });
  }
  onChange(evnt) {
    SelectedFile = evnt.target.files[0];
    document.getElementById('NameBox').value = SelectedFile.name;
    console.log(SelectedFile.name);
    that.setState(
      {
        name: SelectedFile.name,
        SelectedFile: SelectedFile,
      },
      () => {
        console.log(that.state.name);
      }
    );
  }
  render() {
    return (
      <div
        style={{
          maxHeight: '250px',
          left: 0,
          right: 0,
          margin: 'auto',
          overflow: 'auto',
        }}
      >
        <Modal
          closeOnDimmerClick={false}
          closeOnEscape={true}
          style={{
            maxHeight: '250px',
            left: 0,
            right: 0,
            margin: 'auto',
            overflow: 'auto',
          }}
          trigger={
            <span
              className="glyphicon glyphicon-upload ItemIcons
              imageUploadingSpan"
              onClick={() => {
                this.setState({ open: true });
              }}
            ></span>
          }
          open={this.state.open}
          size="mini"
          dimmer="blurring"
        >
          <Modal.Content>
            <Modal.Description>
              <Header>تحميل فيديو جديد </Header>

              <div id="UploadBox" className="row">
                <span
                  id="UploadArea"
                  style={{ maxWidth: '200px', maxHeight: '300px' }}
                >
                  <label>
                    <span className="glyphicon glyphicon-upload  ItemIcons imageUploadingSpan">
                      <input
                        accept={this.state.accept}
                        hidden
                        type="file"
                        id="FileBox"
                        onChange={this.onChange.bind(this)}
                      />
                    </span>
                  </label>

                  <label for="FileBox">Choose A File: </label>

                  <br />
                  <label for="NameBox">Name: </label>

                  <input
                    type="text"
                    id="NameBox"
                    onChange={this.setThName.bind(this)}
                  />
                  <br />
                  <div className="row">
                    <Button
                      type="button"
                      id="UploadButton"
                      class="Button"
                      onClick={this.onClick.bind(this)}
                    >
                      Upload
                    </Button>
                    <Button
                      type="button"
                      id="UploadButton"
                      class="Button"
                      onClick={() => {
                        this.setState({ open: false });
                      }}
                    >
                      Cancle
                    </Button>
                  </div>
                </span>
              </div>
              <div
                style={{
                  maxHeight: '250px',
                  left: 0,
                  right: 0,
                  margin: 'auto',
                  overflow: 'auto',
                }}
              >
                {this.state.isUploading ? (
                  <Progress percent={this.state.uploaded} autoSuccess />
                ) : null}
                {this.state.uploaded === 100 ? (
                  <Button onClick={this.close.bind(this)}>حفظ</Button>
                ) : null}
              </div>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default UploadingItem;

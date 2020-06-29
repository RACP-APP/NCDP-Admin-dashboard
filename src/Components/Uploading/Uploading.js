import React from 'react';
import '../../css/component.css';
import '../../css/buttonStyles.css';
import io from 'socket.io';
import socketIOClient from 'socket.io-client';
import { Progress } from 'semantic-ui-react';
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
      io: io.conn,
      response: 'rrrrrrrrrr',
      file: null,
      name: '',
      uploaded: 0,
      SelectedFile: null,
      isUploading: false,
    };
  }

  componentDidMount() {
    that = this;
    socket = socketIOClient(ENDPOINT);
    var Path = 'http://localhost/public/uploads';

    //------------------------------------------------------- Socket.io Done Event -------------------------------------------------------//
    socket.on('Done', function (data) {
      console.log('On Done Event');
      var Content = 'Video Successfully Uploaded !!';

      document.getElementById('UploadArea').innerHTML = Content;
      that.setState({ uploaded: 100 });
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
      that.setState({ uploaded: MBDone }, () => {
        document.getElementById('MB').innerHTML = MBDone;
      });
    };

    //----------------------- An io.soket Event to Create Block of Date from the Large file if the file is big ---------------------------//
    socket.on('MoreData', function (data) {
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
          Place +
            Math.min(524288, that.state.SelectedFile.size - data['Place']),
          'png'
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
        socket.emit('Start', {
          Name: Name,
          Size: that.state.SelectedFile.size,
        });
      });
      // FReader.readAsArrayBuffer(this.state.file);
    } else {
      alert('Please Select A File');
    }
  }

  setThName(e) {
    console.log(e.target.value);

    // this.setState({ name: e.target.value });
  }
  onChange(evnt) {
    SelectedFile = evnt.target.files[0];
    document.getElementById('NameBox').value = SelectedFile.name;
    this.setState({
      name: SelectedFile.name,
      SelectedFile: SelectedFile,
    });
  }
  render() {
    return (
      <div>
        <div id="UploadBox" className="row">
          <span id="UploadArea" style={{ maxWidth: '200px' }}>
            <label for="FileBox">Choose A File: </label>
            <input
              type="file"
              id="FileBox"
              onChange={this.onChange.bind(this)}
            />
            <br />
            <label for="NameBox">Name: </label>
            <input
              type="text"
              disabled
              id="NameBox"
              onChange={this.setThName.bind(this)}
            />
            <br />
            <button
              type="button"
              id="UploadButton"
              class="Button"
              onClick={this.onClick.bind(this)}
            >
              Upload
            </button>
          </span>
        </div>
        {this.state.isUploading ? (
          <Progress percent={this.state.uploaded} autoSuccess />
        ) : null}
      </div>
    );
  }
}

export default UploadingItem;

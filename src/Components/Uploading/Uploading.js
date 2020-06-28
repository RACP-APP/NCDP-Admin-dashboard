import React from 'react';
import '../../css/component.css';
import '../../css/buttonStyles.css';
import config from '../../config.json';
import axios from 'axios';
import io from 'socket.io';
import socketIOClient from 'socket.io-client';
import fs from 'fs';
var FReader;
var Name;
const ENDPOINT = 'http://localhost:3000/';
var SelectedFile;
var socket;

class UploadingItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      io: io.conn,
      response: 'rrrrrrrrrr',
      file: null,
      name: '',
    };
  }

  componentDidMount() {
    socket = socketIOClient(ENDPOINT);
    var UpdateBar = function (percent) {
      document.getElementById('ProgressBar').style.width = percent + '%';
      document.getElementById('percent').innerHTML =
        Math.round(percent * 100) / 100 + '%';
      var MBDone = Math.round(
        ((percent / 100.0) * SelectedFile.size) / 1048576
      );
      document.getElementById('MB').innerHTML = MBDone;
    };

    socket.on('MoreData', function (data) {
      console.log(
        'ffffffffffffffffffff',
        Math.min(524288, SelectedFile.size - data['Place']),
        'SelectedFile.size',
        SelectedFile.size,
        "data['Place']",

        data['Place'],
        'Place',
        Place
      );
      UpdateBar(data['Percent']);
      var Place = data['Place'] * 524288; //The Next Blocks Starting Position
      var NewFile = Blob; //The Variable that will hold the new Block of Data
      if (SelectedFile.webkitSlice) {
        console.log(
          'webkitSlice',
          'Place',
          data['Place'],
          Place + Math.min(524288, SelectedFile.size - data['Place'])
        );
        NewFile = SelectedFile.webkitSlice(
          Place,
          Place + Math.min(524288, SelectedFile.size - data['Place'])
        );
      } else if (SelectedFile.slice) {
        console.log(
          Math.min(524288, SelectedFile.size - data['Place']) +
            '---------------------'
        );
        NewFile = SelectedFile.slice(
          Place,
          Place + Math.min(524288, SelectedFile.size - data['Place']),
          'png'
        );
        console.log(
          'slice',
          'Place',
          Place,
          Place + Math.min(524288, SelectedFile.size - data['Place']),
          SelectedFile.size,
          NewFile
        );
      } else if (SelectedFile.mozSlice) {
        console.log(
          'mozSlice',
          'Place',
          Place,
          Place + Math.min(524288, SelectedFile.size - data['Place']),
          SelectedFile.size
        );
        NewFile = SelectedFile.mozSlice(
          Place,
          Place + Math.min(524288, SelectedFile.size - data['Place'])
        );
      }
      FReader.readAsBinaryString(NewFile);
    });
  }
  onClick(evnt) {
    // const socket = socketIOClient(ENDPOINT);
    if (document.getElementById('FileBox').value != '') {
      FReader = new FileReader();
      Name = document.getElementById('NameBox').value;
      var Content =
        "<span id='NameArea'>Uploading " +
        SelectedFile.name +
        ' as ' +
        Name +
        '</span>';
      Content +=
        '<div id="ProgressContainer"><div id="ProgressBar"></div></div><span id="percent">0%</span>';
      Content +=
        "<span id='Uploaded'> - <span id='MB'>0</span>/" +
        Math.round(SelectedFile.size / 1048576) +
        'MB</span>';
      document.getElementById('UploadArea').innerHTML = Content;
      FReader.onload = function (evnt) {
        socket.emit('Upload', { Name: Name, Data: evnt.target.result });
      };

      socket.emit('Start', { Name: Name, Size: SelectedFile.size });
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
      file: SelectedFile,
    });
  }
  render() {
    return (
      <div id="UploadBox">
        <h2>Video Uploader</h2>
        <span id="UploadArea">
          <label for="FileBox">Choose A File: </label>
          <input type="file" id="FileBox" onChange={this.onChange.bind(this)} />
          <br />
          <label for="NameBox">Name: </label>
          <input
            type="text"
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
    );
  }
}

export default UploadingItem;

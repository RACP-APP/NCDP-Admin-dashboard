import React from 'react';
import '../../css/component.css';
import axios from 'axios';

import config from '../../config.json';
import Axios from 'axios';
import $ from 'jquery';

class TextItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      thml: <div></div>,
    };
  }

  //------------------- a Func to convert string to HTML -------------------//
  convertHTMLStringToDom(data) {
    var dom = data.replace('/', '\\');
    // var dom = new DOMParser().parseFromString(data, 'text/html');
    // var div = document.createElement('div');
    var div = $('<div> hellow </div>');
    // div.append(dom);
    // div.innerHTML = dom;

    return div;
  }

  componentWillReceiveProps(nextporos) {
    if (nextporos !== this.props) {
      console.log(nextporos.data, '5555555555555555555');
      this.setState(
        {
          data: nextporos.data,
        },
        () => {
          // $('#text' + this.state.data['TextID']).empty();
          // var d = $(
          //   '<div className="row"> Order Number:' +
          //     this.state.data['MediaOrder'] +
          //     '</div><div className="row" > ' +
          //     this.state.data['ContentText'] +
          //     '</div> '
          // ).appendTo('#text' + this.state.data['TextID']);
        }
      );
    }
  }
  componentDidMount() {
    // var d = $(
    //   '<div className="row"> Order Number:' +
    //     this.state.data['MediaOrder'] +
    //     '</div><div className="row" > ' +
    //     this.state.data['ContentText'] +
    //     '</div> '
    // ).appendTo('#text' + this.state.data['TextID']);
  }
  render() {
    return (
      <div style={{ width: '100%' }} id={'text' + this.state.data['TextID']}>
        <span>{'    نص رقم  - ' + this.state.data['MediaOrder']}</span>
      </div>
    );
  }
}

export default TextItem;

import React from 'react';
import '../../css/component.css';
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
    var div = $('<div> hellow </div>');
    return div;
  }

  componentWillReceiveProps(nextporos) {
    if (nextporos !== this.props) {
      this.setState({
        data: nextporos.data,
      });
    }
  }

  render() {
    return (
      <div style={{ width: '100%' }} id={'text' + this.state.data['TextID']}>
        <span>{'  نص رقم  - ' + this.state.data['MediaOrder']}</span>
      </div>
    );
  }
}

export default TextItem;

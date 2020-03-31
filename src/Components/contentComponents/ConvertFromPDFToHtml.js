import React from 'react';
import '../../css/component.css';
import config from '../../config.json';
import axios from 'axios';
import $ from 'jquery';
class ConvertFromPDFToHtml extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      MediaOrder: this.props.MediaOrder,
      contentID: this.props.contentID,
      Error: false,
      type: null,
      disabled: false,
      loaded: 0,
      selectedFile: '',
      errorMessage: ''
    };
  }

  handleDropdownChange(e) {
    console.log(e.target.value);
    if (e.target.value === 'non') {
      this.setState({
        type: e.target.value,
        disabled: true
      });
    } else {
      this.setState({ type: e.target.value, disabled: false });
    }
  }
  onChangeHandler = event => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: 0
    });
  };
  onClickHandler = () => {
    this.setState({
      loading: true
    });
    const data = new FormData();
    console.log(this.state.selectedFile, 'the file to send');
    data.append('file', this.state.selectedFile);
    data.append('contentID', 8);
    data.append('MediaOrder', 2);
    axios
      .post(config[0].server + 'Articles/convertPDF', data, {
        contentID: this.props.contentID,
        MediaOrder: this.props.MediaOrder
      })
      .then(res => {
        console.log('don');
        $('#don').attr('class', 'alert alert-info show ');
        $('#error').attr('class', 'alert alert-danger hide ');
      })
      .catch(error => {
        this.setState(
          {
            errorMessage: error
          },
          () => {
            $('#don').attr('class', 'alert alert-info hide ');
            $('#error').attr('class', 'alert alert-danger show ');
          }
        );
      });
  };

  render() {
    return (
      <div className="row">
        <form method="post" action="#" id="#" className="border ">
          <div className="form-group files">
            <div>Creat from PDF File </div>
            <input
              accept=".pdf "
              type="file"
              className="form-control"
              multiple=""
              onChange={this.onChangeHandler}
            />
          </div>

          <button
            type="button"
            className="btn btn btn-primary btn-block"
            onClick={this.onClickHandler}
          >
            Upload
          </button>
          <div id="error" class=" alert alert-danger hide " role="alert">
            {this.state.errorMessage}
          </div>
          <div id="don" class=" alert alert-info hide" role="alert">
            Convert Is done ..!
          </div>
        </form>
      </div>
    );
  }
}

export default ConvertFromPDFToHtml;

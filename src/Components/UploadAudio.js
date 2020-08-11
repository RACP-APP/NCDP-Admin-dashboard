import React from 'react';
import '../css/component.css';
import axios from 'axios';
import config from '../config.json';

const Types = [
  { value: 'non', selected: true },
  { value: 'vedio', selected: false },
  { value: 'image', selected: false },
  { value: 'audio', selected: false }
];

class UploadResources extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 0,
      disabled: true,
      selectedFile: null
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
    const data = new FormData();
    console.log(this.state.selectedFile, 'the file to send');
    data.append('file', this.state.selectedFile);
    axios.post(config[0].server + 'Articles/upload', data, {}).then(res => {
      // then print response status
      console.log(res.status);
    });
  };

  render() {
    return (
      <div className="container">
        <div className="row">
          <div className="col-md-15">
            <form method="post" action="#" id="#">
              <div className="form-group files">
                <input
                  type="file"
                  className="form-control"
                  multiple=""
                  onChange={this.onChangeHandler}
                />
              </div>
              <button
                type="button"
                className="btn btn-success btn-block"
                onClick={this.onClickHandler}
              >
                Upload
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default UploadResources;

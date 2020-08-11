import React, { Component } from 'react';
import Resizer from 'react-image-file-resizer';
import { Progress, Popup } from 'semantic-ui-react';
import axios from 'axios';
import config from '../config.json';
import ErroeDialog from './ErroeDialog';

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      size: this.props.size || 150,
      imageurl: '',
      accept: this.props.accept,
      name: this.props.name || null,
      statuse: 0,
      ErrorMessage: '',
      open: false,
    };
    this.fileChangedHandler = this.fileChangedHandler.bind(this);
    this.onUploadStart = this.onUploadStart.bind(this);
    this.onUploadSuccess = this.onUploadSuccess.bind(this);
    this.onProgress = this.onProgress.bind(this);
  }

  onUploadStart(e) {
    this.props.onUploadStart(e);
  }

  onUploadSuccess(e) {
    console.log(this.state.imageurl);

    this.props.onUploadSuccess(this.state.imageurl);
  }

  onProgress(e) {
    this.props.onProgress(e);
  }

  fileChangedHandler(event) {
    var that = this;
    var file;
    var fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
      file = event.target.files[0];
    }
    if (fileInput) {
      Resizer.imageFileResizer(
        event.target.files[0],
        that.state.size,
        that.state.size,
        file.type.substring(file.type.indexOf('/') + 1),
        100,
        0,
        (uri) => {
          this.setState(
            {
              uri: uri,
            },
            () => {
              var ref;
              if (this.state.name !== null) {
                // ref = firebase
                axios
                  .post(config[0].server + 'UploadingImage', {
                    name: file.name,
                    type: file.type.substring(file.type.indexOf('/') + 1),
                    data: uri,
                  })
                  .then((result) => {
                    that.setState(
                      {
                        imageurl:
                          config[0].server +
                          'public/uploads/Images/' +
                          file.name,
                        statuse: 100,
                      },
                      () => {
                        that.onUploadSuccess(100);
                      }
                    );
                  })
                  .catch((error) => {
                    this.setState({
                      open: true,
                      ErrorMessage: error.response.data,
                    });
                  });
              } else {
                this.setState({
                  open: true,
                  ErrorMessage: 'الرجاء اخيار صورة ',
                });
              }
            }
          );
        },
        'base64'
      );
    }
  }

  render() {
    return (
      <div>
        <ErroeDialog
          open={this.state.open}
          ErrorMessage={this.state.errorMessage}
        ></ErroeDialog>
        <Popup
          content="click to Upload your Photo"
          trigger={
            <label>
              <span className="glyphicon glyphicon-upload  ItemIcons imageUploadingSpan"></span>

              <input
                hidden
                type="file"
                accept={this.props.sccept}
                onChange={this.fileChangedHandler}
              />
              {!this.state.statuse ? null : (
                <Progress percent={this.state.statuse} autoSuccess />
              )}
            </label>
          }
        />
      </div>
    );
  }
}

export default ImageUpload;

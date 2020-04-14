import React, { Component } from 'react';
import Resizer from 'react-image-file-resizer';
import { Progress, Popup } from 'semantic-ui-react';

import firebase from 'firebase';

class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageurl: '',
      accept: this.props.accept,
      name: this.props.name || null,
      statuse: 0,
    };
    this.fileChangedHandler = this.fileChangedHandler.bind(this);
    this.onUploadStart = this.onUploadStart.bind(this);
    this.onUploadSuccess = this.onUploadSuccess.bind(this);
    this.onProgress = this.onProgress.bind(this);
  }

  UpdateState(url) {
    // this.props.UpdateState(url);
  }
  onUploadStart(e) {
    this.props.onUploadStart(e);
    console.log(e, 'start');
  }

  onUploadSuccess(e) {
    this.props.onUploadSuccess(this.state.imageurl);
    console.log(e, 'seussed');
  }

  onProgress(e) {
    this.props.onProgress(e);
    console.log(e, 'onPrograss');
  }

  fileChangedHandler(event) {
    var that = this;
    var file;
    var fileInput = false;
    if (event.target.files[0]) {
      fileInput = true;
      file = event.target.files[0];
      console.log(file);
    }
    if (fileInput) {
      Resizer.imageFileResizer(
        event.target.files[0],
        300,
        300,
        'JPEG',
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
                ref = firebase.storage().ref().child('name').child(file.name);
              } else {
                ref = firebase.storage().ref().child(file.name);
              }

              console.log(uri.substring(uri.indexOf(',') + 1));

              var uploadTask = ref.putString(
                uri.substring(uri.indexOf(',') + 1),
                'base64',
                {
                  contentType: file.type,
                }
              );

              uploadTask.on('state_changed', function (snapshot) {
                var progress =
                  (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

                console.log(that.state.statuse, 'statuse');
                if (progress === 0) {
                  that.onUploadStart(progress);
                  that.setState({ statuse: progress });
                }
                if (progress > 0 && progress < 100) {
                  that.onProgress(progress);
                  that.setState({ statuse: progress });
                }
                if (progress) {
                  ref.getDownloadURL().then((downlodurl) => {
                    that.setState(
                      {
                        imageurl: downlodurl,
                        statuse: 100,
                      },
                      () => {
                        that.onUploadSuccess(progress);
                        console.log(downlodurl);
                        that.UpdateState(downlodurl);
                      }
                    );
                  });
                }
              });
              // .then((snapshot) => {

              // });
            }
          );
          console.log(uri);
        },
        'base64'
      );
    }
  }

  render() {
    return (
      <div>
        <Popup
          content="click to Upload your Photo"
          trigger={
            <label>
              {!this.state.statuse ? (
                <span className="glyphicon glyphicon-upload  ItemIcons imageUploadingSpan"></span>
              ) : null}
              <input hidden type="file" onChange={this.fileChangedHandler} />
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

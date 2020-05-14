import React from 'react';
import '../../css/component.css';
import config from '../../config.json';
import axios from 'axios';
import $ from 'jquery';
import firebase from 'firebase';
import { Loader, Dimmer } from 'semantic-ui-react';
import ErrorDialogr from '../../Components/ErroeDialog';
// const pdf = require('pdf-parse');
var mammoth = require('mammoth');
const fs = require('fs');
class ConvertFromWordToHtml extends React.Component {
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
      errorMessage: '',
      conertedText: '',
      loaded: '',
      convertin: false,
      open: false,
      animation: 'slide down',
      duration: 500,
    };
  }

  convertDomToHtmlString = (HTMLContent) => {
    return HTMLContent.toString()
      .replace(/\\/g, '\\\\')
      .replace(/"/g, '\\"')
      .replace(/[\n\r]/g, '\\n');
  };

  handleDropdownChange(e) {
    console.log(e.target.value);
    if (e.target.value === 'non') {
      this.setState({
        type: e.target.value,
        disabled: true,
      });
    } else {
      this.setState({ type: e.target.value, disabled: false });
    }
  }
  onChangeHandler1 = (event) => {
    this.setState({
      selectedFile: event.target.files[0],
      loaded: true,
      convertin: true,
    });
    var that = this;
    var file = event.target.files[0];

    var reader = new FileReader();
    reader.onloadend = function (event) {
      var arrayBuffer = reader.result;
      console.log(arrayBuffer, "     console.log(image, 'image');");
      // debugger

      var options = {
        styleMap: [
          'comment-reference => sup',
          'b => em',
          'i => strong',
          'u => em',
          'strike => del',
        ],
        convertImage: mammoth.images.imgElement(function (image) {
          console.log(image);
          // var that = this;
          // this.setState({
          //   loaded: true,
          // });
          console.log('in the converting image func2');

          console.log('in the converting image func');

          return image.read('base64').then(async function (imageBuffer) {
            console.log(image, 'image');
            console.log('in the converting image func2');

            var src = '';
            try {
              var ref = firebase
                .storage()
                .ref()
                .child(
                  Date.now() +
                    '-image.' +
                    image.contentType.substring(
                      image.contentType.indexOf('/') + 1
                    )
                );

              await ref
                .putString(imageBuffer, 'base64', {
                  contentType: image.contentType,
                })
                .then(async function (snapshot) {
                  await ref.getDownloadURL().then((downlodurl) => {
                    src = downlodurl;
                    console.log('in the converting image func');
                  });
                });

              return {
                src: src,
              };
            } catch {
              that.setState({
                open: true,
                errorMessage: 'عذرا ..... حدث خطأ أثناء التحويل',
              });
            }
          });
        }),
      };
      mammoth
        .convertToHtml({ arrayBuffer: arrayBuffer }, options)
        .then(function (resultObject) {
          var result1 = resultObject.value;
          // console.log(result1);
          that.setState({
            conertedText: that.convertDomToHtmlString(result1.toString()),
            loaded: false,
            convertin: false,
            open: false,
            errorMessage: '',
          });
        });
      // console.timeEnd();
    };
    reader.readAsArrayBuffer(file);
  }; //------------//

  //---------------------- handling the converting operation --------------------------------//
  onClickHandler1 = () => {
    var that = this;

    console.log('this.props.contentID,', this.props.contentID);
    axios
      .post(config[0].server + 'Articles/InsertText', {
        ContentID: this.props.contentID,
        ContentText: this.state.conertedText,
        MediaOrder: this.props.MediaOrder,
      })
      .then((result) => {
        this.setState(
          {
            conertedText: '',
            selectedFile: '',
            errorMessage: '',
            Error: false,
            open: false,
          },
          () => {
            $('#don').attr('class', ' show ');
            $('#error').attr('class', ' hide ');
            that.props.getAllContentText();
          }
        );
      })
      .catch((error) => {
        console.log(error);
        this.setState(
          {
            conertedText: '',
            selectedFile: '',
            errorMessage:
              'حدث خطأ أثناء حفظ البيانات  \\n .1 النص طويل جدًا  \\n 2. لا يوجد اتصال',
            Error: true,
            open: true,
          },
          () => {
            $('#don').attr('class', ' hide ');
            $('#error').attr('class', 'show ');
          }
        );
      });
  };

  render() {
    return (
      <div className="row border" style={{ width: '100%' }}>
        <ErrorDialogr
          open={this.state.open}
          ErrorMessage={this.state.errorMessage}
        />
        <div className="">
          {!this.state.convertin ? (
            <label className="glyphicon glyphicon-file	ItemIcons">
              <input
                hidden
                accept=" .docx "
                type="file"
                className="form-control"
                multiple=""
                onChange={this.onChangeHandler1.bind(this)}
              />
              رفع ملف
            </label>
          ) : (
            <Dimmer active>
              <Loader />
            </Dimmer>
          )}
        </div>

        <button
          type="button"
          className="btn btn btn-primary btn-block"
          onClick={this.onClickHandler1.bind(this)}
        >
          تحويل إلى محتوى نصي
        </button>
        <div id="error" class="  hide ">
          {this.state.errorMessage}
        </div>
        <div id="don" class=" hide">
          {this.state.loaded ? 'جار التحميل' : 'تم التحويل ..!'}
        </div>
      </div>
    );
  }
}

export default ConvertFromWordToHtml;

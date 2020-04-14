import React from 'react';
import '../css/component.css';
import '../css/buttonStyles.css';
import config from '../config.json';
import axios from 'axios';
import UploadResources from './Upload';
class AddArticales extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addingMode: false,
      moduleID: this.props.currentModID,
      Title: '',
      Link: '',
    };
    this.AddArticle = this.AddArticle.bind(this);
  }

  AddArticle() {
    if (this.state.Title === '') {
      console.log('connot Insert Topic');
    } else {
      axios
        .post(config[0].server + 'Dashbord/AddTopicsToMoules', {
          ID: this.state.moduleID,
          Title: this.state.Title,
          Link: this.state.Link,
        })
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }

  render() {
    return (
      <div className="AddPanel">
        <div className="row  order-1">
          <div className="col-sm-2">
            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">
                  العنوان
                </span>
              </div>
              <input
                id="Title"
                type="text"
                class="form-control"
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                onChange={(e) => {
                  this.setState({
                    Title: e.target.value,
                  });
                  console.log(e.target.value);
                }}
              />
            </div>

            <div class="input-group input-group-sm mb-3">
              <div class="input-group-prepend">
                <span class="input-group-text" id="inputGroup-sizing-sm">
                  الرابط
                </span>
              </div>
              <input
                id="Title"
                type="text"
                class="form-control"
                aria-label="Small"
                aria-describedby="inputGroup-sizing-sm"
                onChange={(e) => {
                  this.setState({
                    Link: e.target.value,
                  });
                  console.log(e.target.value);
                }}
              />
            </div>
          </div>

          <div className="col-sm-2">
            <div className="row">
              <UploadResources restricts={'images'}></UploadResources>
            </div>
          </div>
          <div className="col-sm-2 ">
            <button
              className="btn-primary  btn-block "
              onClick={this.AddArticle.bind(this)}
            >
              حفظ
            </button>
            <button className="btn-primary  btn-block"> تراجع </button>
          </div>
        </div>
      </div>
    );
  }
}

export default AddArticales;

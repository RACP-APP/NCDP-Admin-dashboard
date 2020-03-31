import React from 'react';
import '../css/component.css';
import '../css/buttonStyles.css';
import axios from 'axios';
import config from '../config.json';
import $ from 'jquery';
import FileUploader from 'react-firebase-file-uploader';
import firebase from 'firebase';
import { Segment, Button } from 'semantic-ui-react';

class ControlPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addtionMode: false,
      Title: '',
      Icon: '',
      Notes: '',
      CreatedDate: null,
      CreatedUser: JSON.parse(localStorage.getItem('user'))['userID'],
      CurrentTpic: parseInt(JSON.parse(localStorage.getItem('CurrentTpic'))),
      url: '',
      imagePreviewUrl: null,
      type: 0,
      disabled: true,
      loading: 0,
      warinig: true,
      warningMessage: ''
    };
    this.addNewArticle = this.addNewArticle.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.handelloadStart = this.handelloadStart.bind(this);
    this.handelSucces = this.handelSucces.bind(this);
  }

  handelloadStart(e) {
    console.log('hhhhhhhhhhhhhhhhh');
  }

  onProgress(e) {
    this.setState({
      loading: e
    });
  }
  handelSucces(e) {
    console.log(firebase.storage);
    firebase
      .storage()
      .ref()
      .child(e)
      .getDownloadURL()
      .then(url => {
        console.log(url);
        this.setState({ url: url });
      });
  }

  onClickHandler = () => {
    //------------------------------saving data in database -----------------------//

    var that = this;
    var nowDate = new Date()
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
    var object = {};
    object['Title'] =
      this.state.Title ||
      'New Article for Topic ' +
        parseInt(JSON.parse(localStorage.getItem('CurrentTpic'))) +
        '-' +
        Date.now();
    object['Notes'] = this.state.Notes || 'this a New Article ......';
    object['UpdateDate'] = nowDate;
    object['CreatedDate'] = nowDate;
    object['CreatedByUser'] = this.state.CreatedUser;
    object['UpdateByUser'] = this.state.UpdateByUser;
    object['TopicID'] = parseInt(localStorage.getItem('CurrentTpic'));
    object['Icon'] =
      this.state.url ||
      'https://firebasestorage.googleapis.com/v0/b/ncdp-270519.appspot.com/o/circle-png-circle-icon-1600.png?alt=media&token=a9f1a9fa-08e8-40a8-8c55-a8e4a3bcb005';
    var that = this;

    axios
      .post(config[0].server + 'Articles/InsertArticles', {
        data: object
      })
      .then(result => {
        this.props.updateFromChild();
        this.setState({
          addtionMode: false,
          warinig: true,
          warningMessage: ' Duplicate Titles'
        });

        $('#ArticlControlPanel').removeClass('row  ControlePanel-col ');
      })
      .catch(error => {
        that.setState({
          warinig: true,
          warningMessage: 'Duplicate Name Or Connection Error'
        });
        console.log(error);
      });
  };

  addNewArticle() {
    if (localStorage.getItem('CurrentTpic') !== null) {
      this.setState({
        addtionMode: true
      });

      $('#ArticlControlPanel').css(' row  ControlePanel-col unclickibl');
    } else {
      this.setState({
        addtionMode: false,
        url: '',
        warningMessage: ''
      });
    }
  }
  render() {
    return (
      <div>
        {this.state.addtionMode ? (
          <div className="">
            <div className="row">
              <div className="col-4 ">
                <input
                  type="image"
                  className="ItemImage header_imge "
                  src={
                    this.state.url ||
                    'https://firebasestorage.googleapis.com/v0/b/ncdp-270519.appspot.com/o/circle-png-circle-icon-1600.png?alt=media&token=a9f1a9fa-08e8-40a8-8c55-a8e4a3bcb005'
                  }
                ></input>

                <label>
                  <span className=" glyphicon glyphicon-pencil  ItemIcons imageUploadingSpan"></span>

                  <FileUploader
                    hidden
                    accept="image/*"
                    name="image"
                    storageRef={firebase.storage().ref()}
                    onUploadStart={this.handelloadStart.bind(this)}
                    onUploadSuccess={this.handelSucces.bind(this)}
                    onProgress={this.onProgress.bind(this)}
                  ></FileUploader>
                  {this.state.loading ? this.state.loading : null}
                </label>

                {this.state.warinig ? (
                  <div class="alert alert-danger" role="alert">
                    {this.state.warningMessage}
                  </div>
                ) : null}
              </div>
              <div className="col-6 rowCenter">
                <div className="row">
                  {/* Title is here  */}

                  <input
                    type="text"
                    class="form-control"
                    placeholder={'This Field must be Inserted'}
                    onChange={e => {
                      this.setState({
                        Title: e.target.value
                      });
                      console.log(e.target.value);
                    }}
                  />
                </div>
                {/* end of title group */}
                {/* start of not group */}
                <div className="row">
                  <input
                    type="text"
                    class="form-control"
                    aria-label="Large"
                    aria-describedby="inputGroup-sizing-sm"
                    onChange={e => {
                      this.setState({
                        Notes: e.target.value
                      });
                      console.log(e.target.value);
                    }}
                  />
                </div>
              </div>
              {/*  --------------------------- Edit Mode Icons ------------------------------------------- */}
              <div className="col-2 rowCenter">
                <div className=" row ItemIcons ">
                  {/* <span class="glyphicon glyphicon-ok"></span> */}
                  <span
                    class="glyphicon glyphicon-ok"
                    onClick={this.onClickHandler.bind(this)}
                  ></span>
                </div>
                <div className=" row ItemIcons ">
                  {/* <span class="glyphicon glyphicon-ok"></span> */}
                  <span
                    class="glyphicon glyphicon-remove-circle"
                    onClick={e => {
                      this.setState({
                        addtionMode: false,
                        warinig: false,
                        warningMessage: ''
                      });
                      $('.glyphicon-plus').attr(
                        'class',
                        'glyphicon glyphicon-plus '
                      );
                    }}
                  ></span>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div id="ArticlControlPanel" className=" row ">
          {/* <span class="glyphicon glyphicon-ok"></span> */}
          <Button
            circular
            icon="step backward"
            onClick={e => {
              this.props.backToModules();
            }}
          />
          <Button
            circular
            icon="add circle"
            onClick={this.addNewArticle.bind(this)}
          />

          {/* <span
            class="glyphicon glyphicon-chevron-left ControlePanel-col "
            onClick={e => {
              this.props.backToModules();
            }}
          ></span>
          <span
            class="glyphicon glyphicon-plus ControlePanel-col "
            onClick={this.addNewArticle.bind(this)}
          ></span> */}
          {/* <span class="glyphicon glyphicon-minus " /> */}
        </div>
      </div>
    );
  }
}

export default ControlPanel;

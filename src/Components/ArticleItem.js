import React from 'react';
import '../css/component.css';
import '../css/buttonStyles.css';
import axios from 'axios';
import axios2 from 'axios';

import config from '../config.json';
import FileUploader from 'react-firebase-file-uploader';
import firebase from 'firebase';
import { Button } from 'semantic-ui-react';

class ArticlesItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editMode: this.props.isUpdate,
      data: this.props.data,
      type: 0,
      disabled: true,
      url: '',
      title: '',
      Notes: '',
      imagePreviewUrl: null,
      Wrnining: false,
      loading: 0
    };
    this.EditArticle = this.EditArticle.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.DeleteArticle = this.DeleteArticle.bind(this);
  }
  //-----------------------function to handel uploading to firbase ----------------//

  handelloadStart(e) {
    console.log('hhhhhhhhhhhhhhhhh');
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
      })
      .catch(error => {
        console.log(error);
      });
  }

  //--------------------------------------------------------//
  deleteMod() {
    this.setState({ Wrnining: true });
  }
  //--------------------------------------------------------------------------------------//
  //--------------- a Func to Delete the Article from the list ---------------------------//
  //--------------------------------------------------------------------------------------//
  DeleteArticle(e) {
    var that = this;
    axios
      .post(config[0].server + 'Articles/DeleteArticle', {
        ID: this.props.data['ArticleID']
      })
      .then(result => {
        console.log(result);
        this.setState(
          {
            editMode: false,
            Wrnining: false
          },
          () => {
            that.props.updateFromChild();
          }
        );
      })
      .catch(error => {
        console.log(error);
      });
  }

  onClickHandler = () => {
    //------------------------------saving data in database -----------------------//

    /////////////////////////////////////////////////

    var nowDate = new Date()
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

    axios2
      .post(config[0].server + 'Articles/UpdateArticle', {
        ID: this.props.data['ArticleID'],
        Title: this.state.title || this.props.data['Title'],
        not: this.state.Notes || this.props.data['Notes'],
        icon:
          this.state.url ||
          this.props.data['Icon'] ||
          'https://firebasestorage.googleapis.com/v0/b/ncdp-270519.appspot.com/o/circle-png-circle-icon-1600.png?alt=media&token=a9f1a9fa-08e8-40a8-8c55-a8e4a3bcb005',
        UpdateDate: nowDate,
        UpdateByUser: JSON.parse(localStorage.getItem('user'))['userID']
      })
      .then(result => {
        console.log('setting the state ---------12----------------------');
        this.setState({ editMode: false });
        this.props.updateFromChild();
      })
      .catch(error => {
        console.log(error);
        console.log('setting the state -----------------33--------------');
        this.setState({
          editMode: false
        });
        //--------------------error Message Here ---------------------//
      });
  };

  //------------------------ a Function to reset the diting mode -------------------------//
  componentWillReceiveProps(nextProps) {
    this.setState({
      editMode: false,
      data: this.props.data
    });
  }

  //-------------------------------------Edit Article Info In Place ------------------------//
  EditArticle(e) {
    console.log(e.target.id);
    this.setState({ editMode: true });
  }
  componentDidMount() {
    this.setState({
      editMode: false,
      data: this.props.data
    });
  }
  //------------------------------get the content of the Article --------------------//
  getContent(e) {
    console.log(this.props.data['TopicID'], this.props.data['ArticleID']);
    localStorage.setItem('selectedArticle', this.props.data['ArticleID']);
    axios
      .post(config[0].server + 'Articles/getContentID', {
        ArticleID: this.props.data['ArticleID']
      })
      .then(result => {
        console.log(result.data, 'iiiiiiiiiiiiiiiiiiiiiiiii');
        this.props.leaveTpicToContent(result.data);
      })
      .catch(error => {
        console.log(error);
      });
  }
  render() {
    let $imagePreview = null;
    if (this.state.imagePreviewUrl) {
      $imagePreview = <img src={this.state.imagePreviewUrl} />;
    } else {
      $imagePreview = (
        <div className="previewText">Please select an Image for Preview</div>
      );
    }

    return (
      <div
        className="row  "
        id={this.props.data['ArticleID']}
        onDoubleClick={this.getContent.bind(this)}
      >
        {this.state.editMode ? (
          // edit mode starts here
          <div className="row">
            <div
              className="col-2"
              style={{
                margin: 'auto'
              }}
            >
              <img
                src={this.state.url || this.props.data.Icon}
                className=" img-thumbnail ItemImage"
              ></img>

              <label className="imageuploadlable">
                <span className=" glyphicon glyphicon-pencil  ItemIcons imageUploadingSpan"></span>
                <FileUploader
                  hidden
                  accept="image/*"
                  name="image"
                  storageRef={firebase.storage().ref()}
                  onUploadStart={this.handelloadStart.bind(this)}
                  onUploadSuccess={this.handelSucces.bind(this)}
                ></FileUploader>
                <span>{this.state.loading ? this.state.loading : null}</span>
              </label>
            </div>

            <div className="col-7 rowCenter">
              <div className="row">
                {/* Title is here  */}
                <div class="input-group">
                  <input
                    type="text"
                    class="form-control"
                    placeholder={this.props.data['Title']}
                    onChange={e => {
                      this.setState({
                        title: e.target.value
                      });
                      console.log(e.target.value);
                    }}
                  />
                </div>
              </div>
              {/* end of title group */}
              {/* start of not group */}
              <div className="row">
                <div class="input-group input-group-lg"></div>
                <input
                  type="text"
                  class="form-control"
                  placeholder={this.props.data['Notes']}
                  aria-label="Large"
                  aria-describedby="inputGroup-sizing-sm"
                  onChange={e => {
                    this.setState({
                      Notes: e.target.value
                    });
                  }}
                />
              </div>
            </div>

            {/*  --------------------------- Edit Mode Icons ------------------------------------------- */}
            <div
              div
              className="col-1  border edit-col shawBackground  rowCenter"
            >
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
                      editMode: false
                    });
                  }}
                ></span>
              </div>
            </div>
          </div>
        ) : (
          //    --------------------------------------secound row ----------------------------------------------//

          //   edit mod Endes Here

          <div className="row">
            <div className="col-2 unclickibl">
              <input
                type="image"
                className="ItemImage img-thumbnail "
                src={process.env.PUBLIC_URL + this.props.data['Icon']}
              ></input>
            </div>

            <div className="col-8 unclickibl">
              <div className="ItemTitle">{this.props.data.Title}</div>
              <div className="ItemInfo">
                Update Date :
                {new Date(this.props.data.UpdateDate).toLocaleString()}
              </div>
              <div className="ItemInfo">
                Update by :{this.props.data.createBy}
              </div>
              <div className="ItemInfo">
                Created by :{this.props.data.UpdatedBy}
              </div>
              <div className="ItemInfo">
                Created Date :
                {new Date(this.props.data.CreatedDate).toLocaleDateString()}
              </div>
              <div className="ItemInfo">
                Times Viewd :{this.props.data.TimesViewd}
              </div>
              <div className="ItemInfo">
                Notes Viewd :{this.props.data.Notes}
              </div>
            </div>
            <div className="col-1" style={{ marginTop: '22px' }}>
              <Button.Group vertical basic size="small">
                <Button icon="edit" onClick={this.EditArticle.bind(this)} />
                {/* <span
                  class="glyphicon glyphicon-pencil margin"
                  onClick={this.EditArticle.bind(this)}
                ></span> */}

                <Button icon="delete" onClick={this.deleteMod.bind(this)} />
                {/* <span
                  class="glyphicon glyphicon-remove margin"
                  onClick={this.deleteMod.bind(this)}
                ></span> */}

                <Button
                  icon="folder open"
                  id={this.props.data['ArticleID']}
                  onClick={this.getContent.bind(this)}
                />
                {/* <span
                  id={this.props.data['ArticleID']}
                  onClick={this.getContent.bind(this)}
                  className="glyphicon glyphicon-folder-open margin"
                ></span> */}
              </Button.Group>
            </div>

            {this.state.Wrnining ? (
              <div className=" container">
                <div className=" row">
                  <div className=" col-7 ItemParagraph">
                    this Operation will couase to Delete all refrence of the
                    Article . Are you sure you want to delete it ?
                  </div>
                </div>

                <div className=" row ArticaleItem ">
                  <div className="col-1 ">
                    <div className="row">
                      <button
                        class="btn btn-outline-danger btn-sm btn-sm-cust "
                        onClick={this.DeleteArticle.bind(this)}
                      >
                        OK
                      </button>
                    </div>
                  </div>

                  <div className="col-1 ">
                    <div className="row">
                      <button
                        class="btn btn-outline-primary btn-sm btn-sm-cust"
                        onClick={e => {
                          this.setState({ Wrnining: !this.state.Wrnining });
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    );
  }
}

export default ArticlesItem;
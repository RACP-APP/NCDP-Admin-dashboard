import React from 'react';
import '../css/component.css';
import '../css/buttonStyles.css';
import axios from 'axios';
import config from '../config.json';
import FileUploader from '../Components/uploadimage';
import { Input, Image, Button } from 'semantic-ui-react';
import ErrorDialog from '../Components/ErroeDialog';

class ArticlesList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Title: '',
      currentModule: this.props.currentModID,
      data: this.props.Artical,
      editionMode: false,
      type: 0,
      disabled: true,
      selectedFile: null,
      imagePreviewUrl: null,
      Wrnining: false,
      WrniningMessage: '',
      open: false,
      url: '',
      loading: 0,
    };
    this.editTopic = this.editTopic.bind(this);
    this.DeleteTopic = this.DeleteTopic.bind(this);
    this.UpdateTopic = this.UpdateTopic.bind(this);
  }

  handelloadStart(e) {}
  handelSucces(e) {
    this.setState({ url: e });
  }

  inPrograss(e) {
    this.setState({
      loading: e,
    });
  }
  //----------------------------------- When the user Confirm Deletion Operation ----------------------------------//
  oktoDeleteTopic(e) {
    axios
      .post(config[0].server + 'Dashbord/DeleteTopic', {
        TopicID: this.state.data['TopicID'],
      })
      .then((result) => {
        this.setState({
          Wrnining: false,
          open: false,
          WrniningMessage: '',
        });
        this.props.goToTopicsViwer();
      })
      .catch((error) => {
        this.setState({
          open: true,
          WrniningMessage: error.response.data,
        });
      });
  }

  //----------------------------------------------------------------------//
  //---------------- re-get the data after Updating -----------------------//
  //----------------------------------------------------------------------//
  UpdateTopic() {
    axios
      .post(config[0].server + 'Dashbord/getTopic', {
        ModuleID: this.state.currentModule,
        TopicID: this.state.data['TopicID'],
      })
      .then((result) => {
        this.setState({
          data: result.data[0],
          WrniningMessage: '',
          open: false,
        });
      })
      .catch((error) => {
        this.state({
          open: true,
          WrniningMessage: error.response.data,
        });
      });
  }
  editTopic() {
    this.setState({
      editionMode: true,
      open: false,
    });
  }

  onClickHandler = () => {
    //------------------------------saving data in database -----------------------//

    var that = this;
    var Title = this.state.Title || this.state.data['Title'];
    var Icon =
      this.state.url ||
      this.state.data['Icon'] ||
      'https://firebasestorage.googleapis.com/v0/b/ncdp-270519.appspot.com/o/circle-png-circle-icon-1600.png?alt=media&token=a9f1a9fa-08e8-40a8-8c55-a8e4a3bcb005';

    axios
      .post(config[0].server + 'Dashbord/UpdatTopic', {
        Title: Title || 'New Topic ',
        Icon: Icon,
        TopicID: this.state.data['TopicID'],
      })
      .then((result) => {
        this.UpdateTopic();
        this.setState({
          editionMode: false,
          disabled: true,
          selectedFile: null,
          imagePreviewUrl: null,
          Wrnining: false,
          url: '',
          loading: 0,
          open: false,
        });
      })
      .catch((error) => {
        //----------------------------------------- vew the Error Message ------------------------------------//
        console.log(error);
        this.setState({
          Wrnining: true,
          WrniningMessage: error.response.data,
          open: true,
        });
      });
  };

  DeleteTopic() {
    this.setState({
      Wrnining: true,
    });
  }

  render() {
    if (this.state.editionMode) {
      return (
        <table id={this.state.data['TopicID']} className="bottomBorder">
          <ErrorDialog
            open={this.state.open}
            ErrorMessage={this.state.WrniningMessage}
          />
          <tr> {this.state.Wrnining ? this.state.WrniningMessage : null}</tr>
          <tr>
            <td>
              <div>
                <Image
                  src={this.state.url || this.state.data['Icon']}
                  size="mini"
                  rounded
                />

                <FileUploader
                  accept="image/*"
                  name="images"
                  onUploadStart={this.handelloadStart.bind(this)}
                  onUploadSuccess={this.handelSucces.bind(this)}
                  onProgress={this.inPrograss.bind(this)}
                ></FileUploader>
              </div>
            </td>
            <td className="margin">
              <Input
                icon="address card"
                iconPosition="left"
                style={{ maxWidth: '140px' }}
                type="text"
                placeholder={this.state.data['Title']}
                onChange={(e) => {
                  this.setState({
                    Title: e.target.value,
                  });
                }}
              />
            </td>
            <td>
              <tr>
                <Button.Group basic size="small">
                  <Button
                    icon="save"
                    onClick={this.onClickHandler.bind(this)}
                  />
                </Button.Group>
              </tr>

              <tr>
                <Button.Group basic size="small">
                  <Button
                    icon="cancel"
                    onClick={(e) => {
                      this.setState({
                        editionMode: false,
                      });
                    }}
                  />
                </Button.Group>
              </tr>
            </td>
          </tr>
        </table>
      );
    } else {
      return (
        <table id={this.state.data['TopicID']} className="bottomBorder">
          <tr>
            <td class="margin   unclickibl">
              <Image src={this.state.data['Icon']} size="mini" rounded />
            </td>
            <td
              class=" menuItem_Title  unclickibl "
              style={{ textAlign: 'center' }}
            >
              {this.state.data['Title']}
            </td>
            <td className="margin">
              <tr>
                <Button.Group basic size="small">
                  <Button icon="edit" onClick={this.editTopic.bind(this)} />
                </Button.Group>
              </tr>
              <tr>
                <Button.Group basic size="small">
                  <Button
                    icon="delete"
                    onClick={(e) => {
                      this.setState({
                        Wrnining: true,
                      });
                    }}
                  />
                </Button.Group>
              </tr>
            </td>
          </tr>
          {this.state.Wrnining ? (
            <tr>
              <td colspan="3" style={{ maxWidth: '200px' }}>
                <div
                  className="row ItemParagraph"
                  style={{ width: '100%', wordBreak: 'break-word' }}
                >
                  {/* -----------------     Warning Message go' here  ---------------------- */}
                  this Operation will couase to Delete all refrence of the
                  Topic.Are you sure you want to delete it ?
                  <div className=" row  ">
                    <button
                      class="btn btn-outline-danger btn-sm btn-sm-cust "
                      onClick={this.oktoDeleteTopic.bind(this)}
                    >
                      تأكيد
                    </button>

                    <button
                      class="btn btn-outline-primary btn-sm btn-sm-cust"
                      onClick={(e) => {
                        this.setState({ Wrnining: !this.state.Wrnining });
                      }}
                    >
                      تراجع
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          ) : null}
        </table>
      );
    }
  }
}

export default ArticlesList;

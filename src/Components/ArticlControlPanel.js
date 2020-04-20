import React from 'react';
import '../css/component.css';
import '../css/buttonStyles.css';
import axios from 'axios';
import config from '../config.json';
import $ from 'jquery';
import FileUploader from '../Components/uploadimage';
import { Button, Image, Grid, Modal, Label, Input } from 'semantic-ui-react';

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
      warningMessage: '',
      open: false,
    };
    this.addNewArticle = this.addNewArticle.bind(this);
    this.onClickHandler = this.onClickHandler.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.handelloadStart = this.handelloadStart.bind(this);
    this.handelSucces = this.handelSucces.bind(this);
  }

  handelloadStart(e) {}

  onProgress(e) {
    this.setState({
      loading: e,
    });
  }
  handelSucces(e) {
    this.setState({ url: e }); // firebase
  }

  onClickHandler = () => {
    //------------------------------saving data in database -----------------------//

    var that = this;
    var nowDate = new Date().toISOString().slice(0, 19).replace('T', ' ');
    var object = {};
    object['Title'] =
      this.state.Title ||
      'مقال جديد للموضوع' +
        parseInt(JSON.parse(localStorage.getItem('CurrentTpic'))) +
        '-' +
        Date.now();
    object['Notes'] = this.state.Notes || 'هذا مقال جديد ......';
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
        data: object,
      })
      .then((result) => {
        this.props.updateFromChild();
        this.setState({
          addtionMode: false,
          warinig: true,
          warningMessage: '',
          open: false,
        });

        $('#ArticlControlPanel').removeClass('row  ControlePanel-col ');
      })
      .catch((error) => {
        that.setState({
          warinig: true,
          warningMessage: 'اسم مكرر أو خطأ في الاتصال',
          open: true,
        });
        console.log(error);
      });
  };

  addNewArticle() {
    if (localStorage.getItem('CurrentTpic') !== null) {
      this.setState({
        addtionMode: true,
        warningMessage: '',
        open: true,
      });

      $('#ArticlControlPanel').css(' row  ControlePanel-col unclickibl');
    } else {
      this.setState({
        addtionMode: false,
        url: '',
        warningMessage: '',
      });
    }
  }

  //---------------------------model functions -----------------------------------//
  show = () => this.setState({ open: true });
  close = () => this.setState({ open: false });

  render() {
    return (
      <div>
        <Button
          circular
          icon="add circle"
          onClick={this.addNewArticle.bind(this)}
        ></Button>

        <Button
          circular
          icon="step backward"
          onClick={(e) => {
            this.props.backToModules();
          }}
        />
        {/* <Button
          circular
          icon="add circle"
          onClick={this.addNewArticle.bind(this)}
        /> */}
        <Modal
          closeOnDimmerClick={false}
          closeOnEscape={true}
          style={{
            maxHeight: '350px',
            left: 0,
            right: 0,
            margin: 'auto',
            overflow: 'auto',
          }}
          size="tiny"
          dimmer="blurring"
          open={this.state.open}
          onClose={this.close}
        >
          <Modal.Header>إضافة وحده جديده</Modal.Header>
          <Modal.Content image>
            <Image
              wrapped
              size="tiny"
              src={
                this.state.url ||
                'https://firebasestorage.googleapis.com/v0/b/ncdp-270519.appspot.com/o/circle-png-circle-icon-1600.png?alt=media&token=8e62158f-a9f1-42fa-b87e-03b390c4db9c'
              }
            />
            <div style={{ position: 'absolute', right: 10, top: '25%' }}>
              <FileUploader
                accept="image/*"
                name="images"
                onUploadStart={this.handelloadStart.bind(this)}
                onUploadSuccess={this.handelSucces.bind(this)}
                onProgress={this.onProgress.bind(this)}
              ></FileUploader>
            </div>
            <Modal.Description>
              <div
                style={{
                  maxWidth: '250px',
                  left: 0,
                  right: 0,
                  margin: 'auto',
                }}
              >
                <Grid>
                  <Grid.Row>
                    <Grid.Column>
                      <Input
                        labelPosition="right"
                        type="text"
                        placeholder="Amount"
                      >
                        <Label>العنوان</Label>
                        <input
                          type="text"
                          class="form-control"
                          placeholder={'يجب إدراج هذا الحقل'}
                          onChange={(e) => {
                            this.setState({
                              Title: e.target.value,
                            });
                            console.log(e.target.value);
                          }}
                        />
                      </Input>
                    </Grid.Column>
                  </Grid.Row>

                  <Grid.Row>
                    <Grid.Column>
                      <Input
                        labelPosition="right"
                        type="text"
                        placeholder="Amount"
                      >
                        <Label>ملاحظات</Label>
                        <input
                          type="text"
                          class="form-control"
                          aria-label="Large"
                          aria-describedby="inputGroup-sizing-sm"
                          onChange={(e) => {
                            this.setState({
                              Notes: e.target.value,
                            });
                            console.log(e.target.value);
                          }}
                        />
                      </Input>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      <p style={{ color: 'red', fontWeight: 'bold' }}>
                        {this.state.warningMessage}
                      </p>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions>
            <div
              style={{
                textAlign: 'center',
              }}
            >
              <Button.Group basic size="small">
                <Button
                  icon="cancel"
                  onClick={(e) => {
                    this.setState({
                      addtionMode: false,
                      warinig: false,
                      warningMessage: '',
                      open: false,
                    });
                    $('.glyphicon-plus').attr(
                      'class',
                      'glyphicon glyphicon-plus '
                    );
                  }}
                />
                <Button icon="save" onClick={this.onClickHandler.bind(this)} />
              </Button.Group>
            </div>
          </Modal.Actions>
        </Modal>
      </div>
    );
  }
}

export default ControlPanel;

import React from 'react';
import '../css/component.css';
import '../css/buttonStyles.css';
import axios from 'axios';
import config from '../config.json';
import $ from 'jquery';

class ModuleControlPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      warinig: false,
      addtionMode: false,
      Title: '',
      selectedFile: null,
      imagePreviewUrl: null,
      type: 0,
      disabled: true,
      loaded: 0
    };
    this.addNewModule = this.addNewModule.bind(this);
  }

  //-------------------------navigate the between addion and nonaddion ------------------------//
  addNewModule() {
    this.setState({
      addtionMode: true
    });
    $('.glyphicon-plus').attr(
      'class',
      'glyphicon glyphicon-plus unclickibl disapled'
    );
  }

  //---------------------------------------------------------------------------------------//
  //-------------------Upload Function for the Icon ---------------------------------------//
  //---------------------------------------------------------------------------------------//
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
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      this.setState({
        selectedFile: file,
        imagePreviewUrl: reader.result,
        loaded: 0
      });
    };

    reader.readAsDataURL(file);
  };

  onClickHandler = () => {
    //------------------------------saving data in database -----------------------//
    const data = new FormData();
    console.log();
    data.append('file', this.state.selectedFile);
    var that = this;
    var nowDate = new Date()
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');
    var FORMdata = {
      Title: this.state.Title,

      Icon: '',
      CreatedBy: JSON.parse(localStorage.getItem('user'))['userID']
    };

    // object['TopicID'] = parseInt(localStorage.getItem('CurrentTpic'));

    if (this.state.selectedFile !== null) {
      var that = this;

      //------------------------- insrt data after uploading the image ---------------------//

      axios
        .post(config[0].server + 'Articles/upload', data)

        .then(result => {
          var Icon = result.data.path;
          console.log('---------------------------------');
          axios
            .post(config[0].server + 'Dashbord/addModule', {
              Title: that.state.Title,
              Icon: Icon,
              CreatedBy: JSON.parse(localStorage.getItem('user'))['userID']
            })
            .then(result => {
              this.setState({
                addtionMode: false,
                warinig: false,
                warningMessage: ' Duplicate Titles'
              });
              that.props.mapModels();

              $('.glyphicon-plus').attr('class', 'glyphicon glyphicon-plus');
            })
            .catch(error => {
              that.setState({
                warinig: false,
                warningMessage: ''
              });
              console.log(error);
            });
        });
    } else {
      var that = this;
      axios
        .post(config[0].server + 'Dashbord/addModule', {
          Title: that.state.Title,
          Icon: 'https://cdn.onlinewebfonts.com/svg/img_370232.png',
          CreatedBy: JSON.parse(localStorage.getItem('user'))['userID']
        })
        .then(result => {
          that.setState({
            addtionMode: false,
            warinig: false,
            warningMessage: ' '
          });
          that.props.mapModels();
          $('.glyphicon-plus').attr('class', 'glyphicon glyphicon-plus');
        })
        .catch(error => {
          console.log(error);
          that.setState({
            warinig: true,
            warningMessage: ' Duplicate Titles'
          });
        });
    }
  };

  addNewArticle() {
    console.log(
      parseInt(localStorage.getItem('CurrentTpic')),
      ' from ArticlControlPanel'
    );
    if (localStorage.getItem('CurrentTpic') !== null) {
      this.setState({
        addtionMode: true
      });
      $('.glyphicon-plus').attr(
        'class',
        'glyphicon glyphicon-plus unclickibl disapled'
      );
    } else {
      this.setState({
        addtionMode: false
      });
    }
  }

  render() {
    return (
      <div className="container">
        {!this.state.addtionMode ? (
          <div className="row">
            {/* --------------------- Showing plus ------------------ */}
            <div className=" row ItemIcons ">
              {/* <span class="glyphicon glyphicon-ok"></span> */}
              <span
                class="glyphicon glyphicon-plus"
                onClick={this.addNewModule.bind(this)}
              ></span>
            </div>
          </div>
        ) : (
          /* ------------------Addition Box -------------------- */
          <div className="row">
            {/* ------------------- upload div ---------------- */}

            <div className="col-2">
              <div className="row">
                <img
                  src={this.state.imagePreviewUrl}
                  className="img-thumbnail  ItemImage "
                ></img>
              </div>
            </div>
            <div className="col-3">
              <div className="row">
                <div className="form-group files">
                  <input
                    accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                    type="file"
                    className="form-control"
                    multiple=""
                    onChange={this.onChangeHandler}
                  />
                </div>
                {this.state.warinig ? (
                  <div class="alert alert-danger" role="alert">
                    {this.state.warningMessage}
                  </div>
                ) : null}
              </div>
              <div className="row">
                {/*  ------------------------ Title and Notes ---------------------------- */}

                <div class="input-group">
                  <div class="input-group-prepend">
                    <span class="input-group-text" id="">
                      Title
                    </span>
                  </div>
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
              </div>
            </div>

            <div className=" col-1">
              <div className="row">
                <div className=" col-1 ItemIcons ">
                  {/* <span class="glyphicon glyphicon-ok"></span> */}
                  <span
                    class="glyphicon glyphicon-ok"
                    onClick={this.onClickHandler.bind(this)}
                  ></span>
                </div>

                <div className=" col-1  ItemIcons ">
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
                        'glyphicon glyphicon-plus'
                      );
                    }}
                  ></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default ModuleControlPanel;

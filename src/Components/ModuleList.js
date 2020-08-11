import React from 'react';
import '../css/component.css';
import '../css/buttonStyles.css';
import axios from 'axios';
import config from '../config.json';
import ImageFileUploader from '../Components/uploadimage';
import ErrorDialog from '../Components/ErroeDialog';
import { Button, Card, Image, Popup, Grid } from 'semantic-ui-react';

import $ from 'jquery';

class ModuleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modelData: this.props.model,
      editMod: false,
      UpdateTitle: '',
      UpdateIcon: '',
      Wrnining: false,
      WrniningMessage: '',
      UpdateWarning: false,
      url: '',
      loading: 0,
      open: false,
    };
    this.goToTopics = this.goToTopics.bind(this);
    this.deletMode = this.deletMode.bind(this);
    this.editModel = this.editModel.bind(this);
    this.SaveModule = this.SaveModule.bind(this);
  }
  //------------------------Handel Firbase Uploading ------------------------//
  handelloadStart(e) {
    this.setState({
      loading: 0,
    });
  }

  inPrograss(e) {
    this.setState({
      loading: e,
    });
  }
  handelSucces(e) {
    this.setState({ url: e });
  }
  UpdateNavegation(e) {
    console.log('onClick');
    var id =
      this.props.model['ModelID'] ||
      parseInt(e.currentTarget.id) ||
      parseInt($(e.currentTarget).attr('data-id'));

    this.props.updateNavigator($(e.currentTarget).attr('data-name'));
  }
  //--------------------------------------------------------------------------//
  //------this fnc is to get the model id and send it back to the Viwer ------//
  //--------------------------------------------------------------------------//

  goToTopics(e) {
    console.log('555555555555555555555555555555555');
    this.UpdateNavegation(e);

    var id =
      parseInt(e.currentTarget.id) ||
      parseInt($(e.currentTarget).attr('data-id'));
    //-------------- if not in the edit mode ----------------//
    if (!this.state.editMod) {
      console.log(e.currentTarget.className, e.currentTarget.id);

      //------------ and if the targer class or data attribute ----------------//
      if (
        e.currentTarget.className == 'ui blue card ModuleCrd ' ||
        parseInt($(e.currentTarget).attr('data-id')) == id
      ) {
        localStorage.setItem('selectedModel', id);
        this.props.convertToTopic();
      }
    }
  }

  //--------------------------------------------------------------------------//
  //------this fnc is to Delete a spasefic Model form the list----------------//
  //--------------------------------------------------------------------------//
  deletMode(e) {
    var that = this;
    console.log(this.props.model['ModelID'], 'the id ');
    axios
      .post(config[0].server + 'Dashbord/DeleteModule', {
        ID: this.props.model['ModelID'],
      })
      .then((result) => {
        this.setState({
          modelData: this.props.model,
          editMod: false,
          UpdateTitle: this.props.model['Title'],
          UpdateIcon: '',
          Wrnining: false,
          WrniningMessage: '',
          UpdateWarning: false,
          open: false,
        });
        that.props.UpdateListafterDelete();
      })
      .catch((error) => {
        this.state({
          open: true,
          WrniningMessage: error.response.data,
        });
      });
  }

  //--------------------------------------------------------------------------//
  //------this fnc is to update a spasefic Model form the list----------------//
  //--------------------------------------------------------------------------//
  editModel(e) {
    this.setState({
      editMod: true,
      open: false,
    });

    this.props.UpdateListafterDelete();
  }

  SaveModule(e) {
    var that = this;
    console.log(this.state.url, 'the url is like this uploaded');
    var image =
      this.state.url ||
      this.props.model['Icon'] ||
      'https://firebasestorage.googleapis.com/v0/b/ncdp-270519.appspot.com/o/circle-png-circle-icon-1600.png?alt=media&token=a9f1a9fa-08e8-40a8-8c55-a8e4a3bcb005';
    axios
      .post(config[0].server + 'Dashbord/UpdateModule', {
        ID: this.state.modelData['ModelID'],
        Title: this.state.UpdateTitle || this.props.model['Title'],
        image: image,
      })
      .then((result) => {
        this.setState({
          editMod: false,
          UpdateWarning: false,
          WrniningMessage: '',
          url: '',
          open: false,
        });
        that.props.UpdateListafterDelete();
      })
      .catch((error) => {
        console.log('update is not commited', error);
        this.setState({
          editMod: true,
          UpdateWarning: true,
          WrniningMessage: 'العناصر المكررة غير مسموح بها',
          UpdateTitle: '',
          open: true,
        });
      });
  }

  render() {
    if (!this.state.editMod) {
      return (
        <Popup
          trigger={
            <Card
              style={{ maxWidth: '210px' }}
              color="blue"
              key="ModelID"
              data-name={this.props.model['Title']}
              id={this.props.model['ModelID']}
              className="ModuleCrd "
              onDoubleClick={this.goToTopics.bind(this)}
              onClick={this.UpdateNavegation.bind(this)}
            >
              <Card.Content>
                <Image
                  floated="right"
                  size="mini"
                  rounded
                  src={this.props.model['Icon']}
                />
                <Card.Header> {this.props.model['Title']}</Card.Header>
                <Card.Meta>
                  <div>
                    <div className="row">
                      <span> انشأ من قبل : {this.props.model['USERS']}</span>
                    </div>
                    <div className="row">
                      <span> رقم :{this.props.model['ModelOrder']}</span>
                    </div>
                  </div>
                </Card.Meta>
              </Card.Content>

              <Card.Content extra>
                <Button.Group basic size="small">
                  <Popup
                    trigger={
                      <Button
                        icon="folder open"
                        data-id={this.state.modelData['ModelID']}
                        onClick={this.UpdateNavegation.bind(this)}
                        onDoubleClick={this.goToTopics.bind(this)}
                      />
                    }
                  >
                    <Popup.Content>
                      DobleClick الرجاء الضغط مرتين لفتح الالموذج
                    </Popup.Content>
                  </Popup>

                  <Button
                    icon="delete"
                    onClick={(e) => {
                      this.setState({ Wrnining: !this.state.Wrnining });
                    }}
                  />
                  <Button icon="edit" onClick={this.editModel.bind(this)} />
                </Button.Group>
              </Card.Content>
              <Card.Content extra>
                {this.state.Wrnining ? (
                  <div>
                    <div className=" row">
                      <div className="ItemParagraph">
                        ستؤدي هذه العملية إلى حذف كل مرجع للوحدة النمطية.
                        <br></br> هل أنت متأكد أنك تريد حذف ذلك ؟
                      </div>
                    </div>

                    <div className=" row ">
                      <button
                        class="btn btn-outline-danger btn-sm btn-sm-cust "
                        onClick={this.deletMode.bind(this)}
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
                ) : null}
              </Card.Content>
            </Card>
          }
          content={'DobleClick الرجاء الضغط مرتين لفتح الالموذج '}
        ></Popup>
      );
    } else {
      return (
        <div>
          <ErrorDialog
            open={this.state.open}
            ErrorMessage={this.state.WrniningMessage}
          />
          <Card
            color="blue"
            style={{ maxWidth: '210px' }}
            key="ModelID"
            id={this.props.model['ModelID']}
            onDoubleClick={this.goToTopics.bind(this)}
          >
            <Card.Content>
              <Image
                rounded
                floated="right"
                size="mini"
                src={this.state.url || this.props.model['Icon']}
              />
              <div>
                <ImageFileUploader
                  accept="image/*"
                  accept=".TIFF  , .TIF, .JPEG , .JPG, .GIF, .png, .RAW  "
                  name="images"
                  size={80}
                  onUploadStart={this.handelloadStart.bind(this)}
                  onUploadSuccess={this.handelSucces.bind(this)}
                  onProgress={this.inPrograss.bind(this)}
                ></ImageFileUploader>
              </div>
              <Card.Header>
                <input
                  id="Title"
                  type="text"
                  class="form-control"
                  aria-label="Small"
                  aria-describedby="inputGroup-sizing-sm"
                  placeholder={
                    this.state.UpdateTitle || this.state.modelData['Title']
                  }
                  onChange={(e) => {
                    this.setState({
                      UpdateTitle: e.target.value,
                    });
                  }}
                />
              </Card.Header>

              <Card.Description>
                انشأ من قبل : {this.props.model['USERS']}
              </Card.Description>
            </Card.Content>

            <Card.Content extra>
              <Button.Group basic size="small">
                <Button
                  icon="cancel"
                  onClick={() => {
                    this.setState({ editMod: false });
                  }}
                />
                <Button icon="save" onClick={this.SaveModule.bind(this)} />
              </Button.Group>
            </Card.Content>
          </Card>
        </div>
      );
    }

    //     <div
    //       key="ModelID"
    //       id={this.props.model['ModelID']}
    //       className="ModuleCrd border"
    //       onDoubleClick={this.goToTopics.bind(this)}
    //     >
    //       {!this.state.editMod ? (
    //         <div
    //           className="container"
    //           style={{ display: 'flex', flexDirection: 'column' }}
    //         >
    //           <div
    //             className="row "
    //             data-toggle="tooltip"
    //             data-placement="top"
    //             title="Double click to view Topics Or Click in Open button"
    //           >
    //             <div className="col-sm-3 unclickibl">
    //               <input
    //                 type="image"
    //                 className="ItemImage header_imge "
    //                 src={this.props.model['Icon']}
    //               ></input>
    //             </div>
    //             <div className="col-sm-8 unclickibl">
    //               <div className="ItemTitle">
    //                 Title : {this.props.model['Title']}
    //               </div>
    //               <div className="ItemInfo">
    //                 Created By : {this.props.model['USERS']}
    //               </div>
    //             </div>
    //           </div>

    //           <div className=" row  borderTop ">
    //             <div className="col   butonsborders ">
    //               <span
    //                 class="glyphicon glyphicon-remove ItemIcons  "
    //                 id={'t-' + this.state.modelData['ModelID']}
    //                 onClick={e => {
    //                   this.setState({ Wrnining: !this.state.Wrnining });
    //                 }}
    //               ></span>
    //             </div>

    //             <div className="col  butonsborders  ">
    //               <span
    //                 class="glyphicon glyphicon-pencil ItemIcons"
    //                 id={'e-' + this.state.modelData['ModelID']}
    //                 onClick={this.editModel.bind(this)}
    //               ></span>
    //             </div>
    //             <div className="col ItemIcons butonsborders ">
    //               <span
    //                 data-id={this.state.modelData['ModelID']}
    //                 className="glyphicon glyphicon-folder-open ItemIcons"
    //                 onClick={this.goToTopics.bind(this)}
    //               ></span>
    //             </div>
    //             {this.state.Wrnining ? (
    //               <div>
    //                 <div className=" row">
    //                   <div className="ItemParagraph">
    //                     this Operation will couase to Delete all refrence of
    //                     the module.
    //                     <br></br> Are you sure you want to delete it ?
    //                   </div>
    //                 </div>

    //                 <div className=" row ">
    //                   <button
    //                     class="btn btn-outline-danger btn-sm btn-sm-cust "
    //                     onClick={this.deletMode.bind(this)}
    //                   >
    //                     OK
    //                   </button>
    //                   <button
    //                     class="btn btn-outline-primary btn-sm btn-sm-cust"
    //                     onClick={e => {
    //                       this.setState({ Wrnining: !this.state.Wrnining });
    //                     }}
    //                   >
    //                     Cancel
    //                   </button>
    //                 </div>
    //               </div>
    //             ) : null}
    //           </div>
    //         </div>
    //       ) : (
    //         <div className="container">
    //           <div className="row">
    //             <div className="col-sm-3 ">
    //               <input
    //                 type="image"
    //                 className="ItemImage header_imge "
    //                 src={this.state.url || this.props.model['Icon']}
    //               ></input>
    //               <label className="imageuploadlable">
    //                 <span className=" glyphicon glyphicon-pencil  ItemIcons imageUploadingSpan"></span>

    //                 <FileUploader
    //                   hidden
    //                   accept="image/*"
    //                   name="image"
    //                   storageRef={firebase.storage().ref()}
    //                   onUploadStart={this.handelloadStart.bind(this)}
    //                   onUploadSuccess={this.handelSucces.bind(this)}
    //                   onProgress={this.inPrograss.bind(this)}
    //                 ></FileUploader>
    //                 {this.state.loading ? this.state.loading : null}
    //               </label>
    //             </div>
    //             <div className="col-sm-7 ">
    //               <div class="input-group input-group-sm mb-3">
    //                 <input
    //                   id="Title"
    //                   type="text"
    //                   class="form-control"
    //                   aria-label="Small"
    //                   aria-describedby="inputGroup-sizing-sm"
    //                   placeholder={
    //                     this.state.UpdateTitle ||
    //                     this.state.modelData['Title']
    //                   }
    //                   onChange={e => {
    //                     this.setState({
    //                       UpdateTitle: e.target.value
    //                     });
    //                   }}
    //                 />
    //               </div>

    //               <button
    //                 type="button"
    //                 class="btn btn-primary  btn-block"
    //                 onClick={this.SaveModule.bind(this)}
    //               >
    //                 save
    //               </button>
    //               <button
    //                 type="button"
    //                 class="btn-primary  btn-block"
    //                 onClick={() => {
    //                   this.setState({ editMod: false });
    //                 }}
    //               >
    //                 Cancel
    //               </button>
    //             </div>
    //           </div>
    //           <div className="row">
    //             {this.state.UpdateWarning ? (
    //               <div className="ItemParagraph">
    //                 {this.state.WrniningMessage}
    //               </div>
    //             ) : null}
    //           </div>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // );
  }
}
export default ModuleList;

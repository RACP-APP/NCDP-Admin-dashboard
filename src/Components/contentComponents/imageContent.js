import React from 'react';
import config from '../../config.json';
import axios from 'axios';
import firebase from 'firebase';
import $ from 'jquery';
import { Table } from 'semantic-ui-react';
import ErrorDialog from '../../Components/ErroeDialog';

class ImageConten extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      linklist: this.props.link,
      ErrorMessage: '',
      Error: false,
      open: false,
    };
  }

  DeleteMedia(e) {
    var mediaID = e.target.id;
    console.log(e.target.id, $(e.target).attr('data-link'));
    // try {
    //   firebase
    //     .storage()
    //     .refFromURL($(e.target).attr('data-link'))
    //     .delete()
    //     .then(() => {
    //       console.log('deleted');
    //     })
    //     .catch((error) => {
    //       this.setState({
    //         ErrorMessage: error.response.data,
    //         open: true,
    //       });
    //     });
    // } catch {
    //   this.setState({
    //     ErrorMessage:
    //       'لا يمكن حذف هذا العنصر الآن يرجى المحاولة مرة أخرى في وقت لاحق ..',

    //     open: true,
    //   });
    // }

    axios
      .post(config[0].server + 'Articles/DeleteMedia', {
        MediaID: mediaID,
      })
      .then((result) => {
        this.setState(
          {
            ErrorMessage: '',
            Error: false,
            open: false,
          },
          () => {
            $('#' + mediaID + 'ErrorMessage').css('alert alert-danger hide ');
          }
        );
        this.props.getAllMedia();
      })
      .catch((error) => {
        this.setState(
          {
            ErrorMessage:
              'لا يمكن حذف هذا العنصر الآن يرجى المحاولة مرة أخرى في وقت لاحق ..',
            Error: true,
            open: true,
          },
          () => {
            $('#' + mediaID + 'ErrorMessage').css('alert alert-danger show ');
          }
        );
      });
  }

  render() {
    return (
      <div>
        <ErrorDialog
          open={this.state.open}
          ErrorMessage={this.state.ErrorMessage}
        />
        {this.props.link.map((link) => {
          if (link['MediaType'] === 'Image') {
            return (
              <Table color="blue" id={link['MediaLink']}>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <span className="ItemIcons">{link['MediaOrder']}</span>
                    </Table.Cell>
                    <Table.Cell>
                      <img
                        className="img-thumbnail  ItemImage"
                        src={link['MediaLink']}
                      ></img>
                    </Table.Cell>
                    <Table.Cell>
                      <span
                        id={link['MediaID']}
                        data-link={link['MediaLink']}
                        className="glyphicon glyphicon-remove ItemIcons"
                        onClick={this.DeleteMedia.bind(this)}
                      ></span>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>
            );
          }
        })}
      </div>
    );
  }
}

{
  /* <div className="" id={link['MediaLink']}>
                    <div
                      id={link['MediaID'] + 'ErrorMessage'}
                      class="alert alert-danger hide"
                      role="alert"
                    >
                      {this.state.ErrorMessage}
                    </div>

                    <span className="ItemIcons">{link['MediaOrder']}</span>
                    <img
                      className="img-thumbnail  ItemImage"
                      src={link['MediaLink']}
                    ></img>
                    <span
                      id={link['MediaID']}
                      data-link={link['MediaLink']}
                      className="glyphicon glyphicon-remove ItemIcons"
                      onClick={this.DeleteMedia.bind(this)}
                    ></span>
                  </div> */
}
export default ImageConten;

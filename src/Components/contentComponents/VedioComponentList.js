import React from 'react';

import axios from 'axios';
import config from '../../config.json';
import $ from 'jquery';
import firebase from 'firebase';
import { Table } from 'semantic-ui-react';

class VedioConmponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      linklist: this.props.link,
      statecurrentLink: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
      ErrorMessage: '',
      Error: false,
      vediourl: ''
    };
  }

  DeleteMedia(e) {
    var mediaID = e.target.id;
    var linkref = firebase.storage().refFromURL($(e.target).attr('data-link'));
    var id = e.target.id;
    var that = this;
    linkref
      .delete()
      .then(() => {
        console.log('don');
      })
      .catch(error => {
        console.log('none');
      });

    axios
      .post(config[0].server + 'Articles/DeleteMedia', {
        MediaID: e.target.id
      })
      .then(result => {
        this.setState(
          {
            Error: false,
            ErrorMessage: ''
          },
          () => {
            $('#' + id + 'vErrorMessage').css('alert alert-danger show ');
            that.props.getAllMedia();
          }
        );
      })
      .catch(error => {
        console.log(error);
        this.setState(
          {
            Error: true,
            ErrorMessage:
              'Cannot delete this item right now please try again later ..'
          },
          () => {
            $('#' + id + 'vErrorMessage').css('alert alert-danger show ');
          }
        );
      });
  }

  render() {
    return (
      <div className="row ">
        <ul>
          {this.props.link.map(link => {
            if (link['MediaType'] === 'vedio') {
              return (
                <Table color="blue">
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>
                        <span> {link['MediaID']}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <div class="embed-responsive embed-responsive-16by9">
                          <iframe
                            class="embed-responsive-item"
                            src={link['MediaLink'].toString()}
                            allowfullscreen
                          ></iframe>
                        </div>
                      </Table.Cell>
                      <Table.Cell>
                        <span
                          data-link={link['MediaLink'].toString()}
                          id={link['MediaID']}
                          className="glyphicon glyphicon-remove ItemIcons"
                          onClick={this.DeleteMedia.bind(this)}
                        ></span>
                      </Table.Cell>
                    </Table.Row>
                  </Table.Body>
                </Table>
                // <li className="border shawBackground">
                //   <div
                //     id={link['MediaID'] + 'vErrorMessage'}
                //     class="alert alert-danger hide"
                //     role="alert"
                //   >
                //     {this.state.ErrorMessage}
                //   </div>

                //   <video
                //     controls
                //     type="video/*"
                //     src={link['MediaLink'].toString()}
                //     width="90%"
                //     height="90%"
                //   >
                //     <source src="video.wmv" />
                //     Your browser doesn't support video, you may download the
                //     video instead: <a href="video.ogv">Ogg</a>
                //   </video>

                // </li>
              );
            }
          })}
        </ul>
      </div>
    );
  }
}
export default VedioConmponent;

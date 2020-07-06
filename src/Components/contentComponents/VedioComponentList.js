import React from 'react';

import axios from 'axios';
import config from '../../config.json';
import $ from 'jquery';
import firebase from 'firebase';
import { Table } from 'semantic-ui-react';
import ErrorDialog from '../../Components/ErroeDialog';
import io from 'socket.io';
import socketIOClient from 'socket.io-client';
var FReader;
var Name;
const ENDPOINT = 'http://162.247.76.211:3000/';
var SelectedFile;
var socket;
var that;

class VedioConmponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      linklist: this.props.link,
      statecurrentLink: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
      ErrorMessage: '',
      Error: false,
      vediourl: '',
      open: false,
    };
  }

  DeleteMedia(e) {
    var mediaID = e.target.id;
    socket.emit('delete', { mediaID });
    // var linkref = firebase.storage().refFromURL($(e.target).attr('data-link'));
    var id = e.target.id;

    axios
      .post(config[0].server + 'Articles/DeleteMedia', {
        MediaID: e.target.id,
      })
      .then((result) => {
        this.setState(
          {
            Error: false,
            open: false,
            ErrorMessage: '',
          },
          () => {
            $('#' + id + 'vErrorMessage').css('alert alert-danger show ');
            that.props.getAllMedia();
          }
        );
      })
      .catch((error) => {
        console.log(error);
        this.setState(
          {
            Error: true,
            open: true,
            ErrorMessage:
              'Cannot delete this item right now please try again later ..',
          },
          () => {
            $('#' + id + 'vErrorMessage').css('alert alert-danger show ');
          }
        );
      });
  }

  componentDidMount() {
    that = this;
    socket = socketIOClient(ENDPOINT, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });
  }
  render() {
    return (
      <div className="row ">
        <ErrorDialog
          open={this.state.open}
          ErrorMessage={this.state.ErrorMessage}
        />
        <ul>
          {this.props.link.map((link) => {
            if (link['MediaType'] === 'vedio') {
              return (
                <Table color="blue">
                  <Table.Body>
                    <Table.Row>
                      <Table.Cell>
                        <span> {link['MediaOrder']}</span>
                      </Table.Cell>
                      <Table.Cell>
                        <video
                          width="110px"
                          height="50px"
                          autobuffer="autobuffer"
                          autoPlay=""
                          loop="loop"
                          controls="controls"
                          poster="/_img/videostill.jpg"
                        >
                          <source
                            src={link['MediaLink'].toString()}
                            type='video/mp4; codecs="amp4v.20.8, mp4a.40.2"'
                          />
                          <source
                            src={link['MediaLink'].toString()}
                            type='video/mp4; codecs="amp4v.20.8, mp4a.40.2"'
                          />
                          <source
                            src={link['MediaLink'].toString()}
                            type='video/mp4; codecs="avc1.42E01E, mp4a.40.2"'
                          />
                          <source
                            src={link['MediaLink'].toString()}
                            type='video/ogg; codecs="theora, vorbis"'
                          />
                          unsported vedio
                        </video>
                        {/* <div
                          class="jsmpeg"
                          style={{ width: '200px', height: '50px' }}
                          data-url={link['MediaLink'].toString()}
                        ></div> */}
                        {/* <embed
                          type="application/x-vlc-plugin"
                          pluginspage="http://www.videolan.org"
                          width="640"
                          height="480"
                          src={link['MediaLink'].toString()}
                          id="vlc"
                        ></embed> */}
                        {/* <div class="embed-responsive embed-responsive-16by9">
                          <iframe
                            class="embed-responsive-item"
                            src={link['MediaLink'].toString()}
                            allowfullscreen
                          ></iframe>
                        </div> */}
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
              );
            }
          })}
        </ul>
      </div>
    );
  }
}
export default VedioConmponent;

import React from 'react';
import PlayAudio from 'react-simple-audio-player';
import '../../../node_modules/react-h5-audio-player/lib/styles.css';
import config from '../../config.json';
import axios from 'axios';
import $ from 'jquery';
import firebase from 'firebase';
import ErrorDialogr from '../../Components/ErroeDialog';

import { Table } from 'semantic-ui-react';

import chroma from 'chroma-js';
const colorScale = chroma.scale(['#0199CB', '#ffffff']).mode('lch').colors(5);

class AudioPlayerContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      linklist: this.props.link,
      statecurrentLink: 'https://media.w3.org/2010/05/sintel/trailer_hd.mp4',
      ErrorMessage: '',
      Error: false,
      open: false,
      animation: 'slide down',
      duration: 500,
    };
  }

  DeleteMedia(e) {
    // var linkref = firebase.storage().refFromURL($(e.target).attr('data-link'));
    // var id = e.target.id;
    // linkref
    //   .delete()
    //   .then(() => {
    //     this.setState({
    //       open: false,
    //       ErrorMessage: '',
    //     });
    //   })
    //   .catch((error) => {
    //     console.log('none');
    //     this.setState({
    //       open: true,
    //       ErrorMessage: error.response.data,
    //     });
    //   });

    axios
      .post(config[0].server + 'Articles/DeleteMedia', {
        MediaID: e.target.id,
      })
      .then((result) => {
        console.log(result);
        this.setState(
          {
            Error: false,
            ErrorMessage: '',
            open: false,
          },
          () => {
            this.props.getAllMedia();
          }
        );
      })
      .catch((error) => {
        this.setState({
          Error: true,
          ErrorMessage:
            'لا يمكن حذف هذا العنصر الآن يرجى المحاولة مرة أخرى في وقت لاحق ..',
          open: true,
        });
      });
  }

  render() {
    return (
      <div>
        <ErrorDialogr
          open={this.state.open}
          ErrorMessage={this.state.ErrorMessage}
        />

        {this.props.link.map((link) => {
          if (link['MediaType'] === 'audio') {
            return (
              <Table color="blue" id={link['MediaLink']}>
                <Table.Body>
                  <Table.Row>
                    <Table.Cell>
                      <span className="ItemIcons">{link['MediaOrder']}</span>
                    </Table.Cell>
                    <Table.Cell>
                      {/* <audio className="audio-element">
                        <source src={link['MediaLink']}></source>
                      </audio> */}
                      <PlayAudio
                        url={link['MediaLink']}
                        colorScale={colorScale}
                      />
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

//  <li className="row shawBackground border" id={link['MediaLink']}>
//    <div className="" id={link['MediaLink']}>
//      <div
//        id={link['MediaID'] + 'AErrorMessage'}
//        class="alert alert-danger hide"
//        role="alert"
//      >
//        {this.state.ErrorMessage}
//      </div>
//      <span> {link['MediaOrder']}</span>
//      <PlayAudio url={link['MediaLink']} colorScale={colorScale} />
//      <span
//        id={link['MediaID']}
//        data-link={link['MediaLink']}
//        className="glyphicon glyphicon-remove ItemIcons"
//        onClick={this.DeleteMedia.bind(this)}
//      ></span>
//    </div>
//  </li>;
export default AudioPlayerContent;

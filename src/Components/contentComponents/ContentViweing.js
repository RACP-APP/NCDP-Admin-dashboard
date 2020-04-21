import React from 'react';
import '../../css/component.css';
import axios from 'axios';
import config from '../../config.json';
import OrderingContent from './OrderContents';
import AudioPlayer from 'react-h5-audio-player';
import '../../../node_modules/react-h5-audio-player/lib/styles.css';
import {
  Grid,
  TransitionablePortal,
  Segment,
  Label,
  Button,
} from 'semantic-ui-react';

const transitions = [
  'browse',
  'browse right',
  'drop',
  'fade',
  'fade up',
  'fade down',
  'fade left',
  'fade right',
  'fly up',
  'fly down',
  'fly left',
  'fly right',
  'horizontal flip',
  'vertical flip',
  'scale',
  'slide up',
  'slide down',
  'slide left',
  'slide right',
  'swing up',
  'swing down',
  'swing left',
  'swing right',
  'zoom',
];
const options = transitions.map((name) => ({
  key: name,
  text: name,
  value: name,
}));

class AllToghterConmponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      items: [],
      open: false,
      Update: false,
      contentID: this.props.contentID,
      errorMessage: '',
      animation: 'browse',
      duration: 500,
      open: false,
    };

    this.mapContents = this.mapContents.bind(this);
  }

  //---------------------------------------------------------------------------------------------------------------------------//
  closePortal = () =>
    this.setState({ Update: false, open: false }, () => {
      console.log(this.state.Update, 'Update');
    });
  handleClose = () => this.setState({ Update: true });
  handleOpen = () => this.setState({ open: true });
  //---------------------------------------------------------------------------------------------------------------------------//
  //--------------------------------------------Map the Contents in the Dom -----------------------------------------------------//
  componentDidMount() {
    this.mapContents();
  }
  //-------------------------------------------------------------------------------------------------------------------------------//
  //------------------------------------- Check the component props if they changed and chane the state ---------------------------//
  //------------------------------------------------ and then re-map the element to the Dom ---------------------------------------//
  //-------------------------------------------------------------------------------------------------------------------------------//
  componentWillReceiveProps(nextpro) {
    if (nextpro.data !== this.props.data) {
    }
    this.setState(
      {
        data: nextpro.data,
      },
      () => {
        this.mapContents();
      }
    );
  }
  // -------------------------------------------- Update After re-Order ------------------------------------------//
  getAllContent() {
    axios
      .post(config[0].server + 'Articles/GetAllMedia', {
        ContentID: this.state.contentID,
      })
      .then((result) => {
        this.setState(
          {
            data: [...result.data].sort((a, b) => {
              return a.MediaOrder - b.MediaOrder;
            }),
          },
          () => {
            //------------------------//

            axios
              .post(config[0].server + 'Articles/gettText', {
                contentID: this.state.contentID,
              })
              .then((result) => {
                this.setState(
                  {
                    data: [...this.state.data, ...result.data].sort((a, b) => {
                      return a.MediaOrder - b.MediaOrder;
                    }),
                  },
                  () => {
                    console.log(this.state.data, 'result');

                    this.mapContents();
                    this.props.isReorede();
                  }
                );
              })
              .catch((error) => {
                this.setState({
                  errorMessage: error.response.data,
                });
              });
          }
        );
      })
      .catch((error) => {
        this.setState({
          errorMessage: 'error',
        });
      });
  }

  mapContents() {
    // console.log('ttttttttttttttttttttt', this.state.data);
    var myComponents = [];
    this.setState({ items: [] }, () => {
      //------------------------------------------- remove all previouse elements -----------------------------------------------------//

      for (var i = 0; i < this.state.data.length; i++) {
        //------------------------------------------------- if the content is an image ------------------------------------------------//
        if (this.state.data[i]['MediaType'] === 'Image') {
          myComponents[i] = (
            <Grid.Row>
              <ImagViweing data={this.state.data[i]} />
            </Grid.Row>
          );
        }
        //------------------------------------------------ if the content is an Text ---------------------------------------------------//

        if (this.state.data[i]['MediaType'] === 'Text') {
          myComponents[i] = (
            <Grid.Row>
              <TextViweing data={this.state.data[i]} />
            </Grid.Row>
          );
        }

        //------------------------------------------ if the content is an audio ---------------------------------------------------------//

        if (this.state.data[i]['MediaType'] === 'vedio') {
          myComponents[i] = (
            <Grid.Row>
              <VedioViewing data={this.state.data[i]} />
            </Grid.Row>
          );
        }

        //---------------------------------------------- if the content is an vedio ------------------------------------------------------//

        if (this.state.data[i]['MediaType'] === 'audio') {
          myComponents[i] = (
            <Grid.Row>
              <AudioViewing data={this.state.data[i]} />
            </Grid.Row>
          );
        }
      }

      this.setState(
        {
          items: myComponents,
        },
        () => {
          console.log(this.state.items);
        }
      );
    });
  }
  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column>
            <Button
              content="إعادة ترتيب المحتوى "
              disabled={this.state.open}
              positive
              onClick={this.handleOpen.bind(this)}
            />

            <TransitionablePortal
              transition={{
                animation: this.state.animation,
                duration: this.state.duration,
              }}
              onClose={this.handleClose}
              open={this.state.open}
              style={{ left: 0 }}
            >
              <Segment
                style={{
                  left: '1%',
                  position: 'fixed',
                  top: '2%',
                  width: '14%',
                  zIndex: 1000,
                  height: window.innerHeight - 30,
                  minWidth: '160px',
                  overflow: 'auto',
                }}
              >
                <OrderingContent
                  data={this.state.data}
                  Update={this.state.Update}
                  closePortal={this.closePortal.bind(this)}
                  getAllContent={this.getAllContent.bind(this)}
                />
                <Button
                  content="خفظ "
                  negative
                  onClick={this.handleClose.bind(this)}
                />
              </Segment>
            </TransitionablePortal>
          </Grid.Column>
        </Grid.Row>
        {this.state.items}
      </Grid>
    );
  }
}
export default AllToghterConmponent;

//--------------------------------------------------------------------------------------------------------//
//-------------------------------------------- TextViweing Component -------------------------------------//
//--------------------------------------------------------------------------------------------------------//
class TextViweing extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: this.props.data };
  }
  convertHTMLStringToDom(data) {
    var dom = data.replace('//', '\\');

    return dom;
  }

  render() {
    var parse = require('html-react-parser');

    return (
      <Segment raised style={{ width: '100%' }}>
        <Label as="a" color="blued" ribbon>
          رقم : {this.state.data['MediaOrder']}
        </Label>

        <div id={'T' + this.state.data['TextID']} style={{ width: '100%' }}>
          <div class="row">
            {parse(this.convertHTMLStringToDom(this.state.data['ContentText']))}
          </div>
        </div>
      </Segment>
    );
  }
}

//--------------------------------------------------------------------------------------------------------//
//-------------------------------------------- ImagViweing Component -------------------------------------//
//--------------------------------------------------------------------------------------------------------//
class ImagViweing extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: this.props.data };
  }

  render() {
    return (
      <Segment raised style={{ width: '100%' }}>
        <Label as="a" color="blued" ribbon>
          رقم : {this.state.data['MediaOrder']}
        </Label>

        <div>
          <div class="row shawBackground border"></div>
          <div class="row">
            <img class="img-row" src={this.state.data['MediaLink']}></img>
          </div>
        </div>
      </Segment>
    );
  }
}

//--------------------------------------------------------------------------------------------------------//
//-------------------------------------------- AudioViewing Component ------------------------------------//
//--------------------------------------------------------------------------------------------------------//
class AudioViewing extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: this.props.data };
  }

  render() {
    return (
      <Segment raised style={{ width: '100%' }}>
        <Label as="a" color="blued" ribbon>
          رقم : {this.state.data['MediaOrder']}
        </Label>
        <div class="row" id={'a-' + this.state.data['MediaID']}>
          <AudioPlayer AudioPlayer src={this.state.data['MediaLink']} />
        </div>
      </Segment>
    );
  }
}

//--------------------------------------------------------------------------------------------------------//
//---------------------------------------------- VedioViwer Component ------------------------------------//
//--------------------------------------------------------------------------------------------------------//
class VedioViewing extends React.Component {
  constructor(props) {
    super(props);
    this.state = { data: this.props.data };
  }
  render() {
    return (
      <Segment raised style={{ width: '100%' }}>
        <Label as="a" color="blued" ribbon>
          رقم : {this.state.data['MediaOrder']}
        </Label>
        <div class="row">
          <div class="row">
            <video
              controls
              type="video/*"
              src={this.state.data['MediaLink']}
              width="100%"
              height="100%"
            >
              <source src="video.wmv" />
              متصفحك لا يدعم الفيديو ، يمكنك تنزيل الفيديو بدلا من:{' '}
              <a href="video.ogv">Ogg</a>
            </video>
          </div>
        </div>
      </Segment>
    );
  }
}

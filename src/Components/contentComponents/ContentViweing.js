import React from 'react';
import '../../css/component.css';
import $ from 'jquery';
import AudioPlayer from 'react-h5-audio-player';
import '../../../node_modules/react-h5-audio-player/lib/styles.css';
import ReactDOM from 'react-dom';
import { Segment, Button, Image, Grid } from 'semantic-ui-react';

class AllToghterConmponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    };

    this.mapContents = this.mapContents.bind(this);
  }

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
      console.log('new props -------------------------------------', nextpro);
    }
    this.setState(
      {
        data: nextpro.data
      },
      () => {
        this.mapContents();
      }
    );
  }

  convertHTMLStringToDom(data) {
    var dom = data.replace('//', '\\');

    return dom;
  }

  mapContents() {
    //------------------------------------------- remove all previouse elements -----------------------------------------------------//
    $('#items').empty();

    for (var i = 0; i < this.state.data.length; i++) {
      //------------------------------------------------- if the content is an image ------------------------------------------------//
      if (this.state.data[i]['MediaType'] === 'Image') {
        var j = $(
          ' <li >  <div class="row shawBackground border">' +
            this.state.data[i]['MediaOrder'] +
            '</div><div class ="row"><img class="img-row"  src=' +
            this.state.data[i]['MediaLink'] +
            '></img> </div></li>'
        ).appendTo('#items');
      }
      //------------------------------------------------ if the content is an Text ---------------------------------------------------//

      if (this.state.data[i]['MediaType'] === 'Text') {
        var dom = $(
          this.convertHTMLStringToDom(this.state.data[i]['ContentText'])
        );
        var node = $(
          '<li id="T' +
            this.state.data[i]['TextID'] +
            '" ><div class="row shawBackground border">' +
            this.state.data[i]['MediaOrder'] +
            '</div><div class ="row">' +
            this.convertHTMLStringToDom(this.state.data[i]['ContentText']) +
            '</div></li>'
        );
        node.appendTo('#items');
      }

      //------------------------------------------ if the content is an audio ---------------------------------------------------------//

      if (this.state.data[i]['MediaType'] === 'vedio') {
        var j = $(
          ' <li class="row"> <div class="row shawBackground border">' +
            this.state.data[i]['MediaOrder'] +
            '</div><div class="row"><video controls  type="video/*" src=' +
            this.state.data[i]['MediaLink'] +
            '   width="100%"   height="100%">  <source src="video.wmv" />  ' +
            ' Your browser doesnt support video, you may download the video instead: <a href="video.ogv">Ogg</a> ' +
            ' </video></div></li>'
        ).appendTo('#items');
      }

      //---------------------------------------------- if the content is an vedio ------------------------------------------------------//

      if (this.state.data[i]['MediaType'] === 'audio') {
        var d = $(
          '<li  class="row" id="a-' +
            this.state.data[i]['MediaID'] +
            '" > <div class="row shawBackground border">' +
            this.state.data[i]['MediaOrder'] +
            '</div></li>'
        );
        $(d).appendTo('#items');
        console.log($('#a-' + this.state.data[i]['MediaID']));
        ReactDOM.render(
          <AudioPlayer AudioPlayer src={this.state.data[i]['MediaLink']} />,
          document.getElementById('a-' + this.state.data[i]['MediaID'])
        );

        $(
          ' <div class="row shawBackground border">' +
            this.state.data[i]['MediaOrder'] +
            '      </div>'
        ).appendTo('#a-' + this.state.data[i]['MediaID']);
      }
    }
  }

  render() {
    return (
      <Grid>
        <Grid.Row>
          <div className=" row">
            <ol id="items"></ol>
          </div>
        </Grid.Row>
      </Grid>
    );
  }
}
export default AllToghterConmponent;

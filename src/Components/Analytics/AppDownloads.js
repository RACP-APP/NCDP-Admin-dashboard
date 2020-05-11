import React from 'react';
import '../../css/component.css';
import '../../css/buttonStyles.css';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import config from '../../config.json';
import ErrorDialog from '../../Components/ErroeDialog';
import { Grid, Segment, Dropdown, Label, Table } from 'semantic-ui-react';

// const AppDwonLoad = require('../../ChartData.json')['appDownload'];

class MainAnalytic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropDownVlues: [],
      selectedValue: '2020',
      data: {},
      open: false,
      ErrorMessage: '',
    };
  }

  //------------------------------------ a function to generate a random Color -----------------------------------//
  random_rgba() {
    var o = Math.round,
      r = Math.random,
      s = 255;
    return (
      'rgba(' +
      o(r() * s) +
      ',' +
      o(r() * s) +
      ',' +
      o(r() * s) +
      ',' +
      r().toFixed(1) +
      ')'
    );
  }

  //------------------------ Handel the Change Of Selected Value of dropdown --------------------------------------//
  ChangeDataSet(e, { value }) {
    console.log(value);
    if (value === 'Totals') {
      this.initialValueForChart();
    } else {
      this.getChartForEachMonth(e, value);
    }
  }

  //---------------------------- A func To Creat A Chart For Each Month Selected ----------------------------------//
  getChartForEachMonth(e, value) {
    var labels = [];
    var dataSet = [];
    var count = 1;

    axios
      .post(config[0].server + 'CreraJsonChart', { type: 'appDownload' })
      .then((result) => {
        console.log(result.data['appDownload'][value], value);
        for (var week in result.data['appDownload'][value]) {
          for (
            var i = 0;
            i < result.data['appDownload'][value][week]['days'].length;
            i++
          ) {
            //-------------------- create Lables and data Array to the data Set ---------------------------------------//
            labels.push(value + '-' + count);
            dataSet.push(result.data['appDownload'][value][week]['days'][i]);
            count++;
          }
        }
        //--------------------------------------------------------------------------------------------------------------//
        var data = {
          labels: labels,
          datasets: [
            {
              data: dataSet,
              label: value,
              backgroundColor: this.random_rgba(),
            },
          ],
          options: {
            title: {
              text: 'App Downloads ' + value,
              display: true,
              fontSize: 25,
            },
            responsive: true,
          },
        };
        console.log(value, e.target);
        //---------------------------------------------------------------------------------------------------------------------------//
        this.setState({
          data: data,
          open: false,
          ErrorMessage: '',
        });
      })
      .catch((error) => {
        this.setState({
          open: true,
          ErrorMessage: error.response.data,
        });
      });
  }
  //--------------------------- do the intial value for the dataset ------------------------------//
  initialValueForChart() {
    var labels = [];
    var datasets = [];
    let count = 0;

    //--------------- get the data -----------------------//
    axios
      .post(config[0].server + 'CreraJsonChart', { type: 'appDownload' })
      .then((result) => {
        console.log(result.data);

        // console.log(result.data, 'result');
        for (var month in result.data['appDownload']) {
          var data = [];
          for (var week in result.data['appDownload'][month]) {
            labels = Object.keys(result.data['appDownload'][month]);
            data.push(result.data['appDownload'][month][week]['tatal']);
          }
          datasets[count] = {
            data: data,
            label: month,
            backgroundColor: this.random_rgba(),
          };
          count++;
        }
        this.setState({
          data: {
            labels: labels,
            datasets: datasets,
            open: false,
            ErrorMessage: '',
          },
        });
      })
      .catch((error) => {
        this.setState({
          open: true,
          ErrorMessage: error.response.data,
        });
      });
  }

  //--------------------------------------------------------------------------------------------------------//

  componentDidMount() {
    var dropDownVluesTemp = [{ key: 'Totals', text: '2020', value: 'Totals' }];
    this.initialValueForChart();
    //---------------------------------------------------------------------------------------------------------//
    //--------------- get the data -----------------------//
    console.log("result.data['appDownload'], ");
    axios
      .post(config[0].server + 'CreraJsonChart', { type: 'appDownload' })
      .then((result) => {
        // console.log(result.data, 'result');
        //---------------------------------------------------------------------------------------------------------//
        for (var Month in result.data['appDownload']) {
          console.log(result.data['appDownload'], Month);
          dropDownVluesTemp.push({
            key: Month,
            text: Month,
            value: Month,
          });
        }
        this.setState({
          dropDownVlues: dropDownVluesTemp,
          open: false,
          ErrorMessage: '',
        });
      })
      .catch((error) => {
        this.setState({
          open: true,
          ErrorMessage: error.response.data,
        });
      });
  }

  render() {
    return (
      <Segment placeholder>
        <ErrorDialog
          open={this.state.open}
          ErrorMessage={this.state.ErrorMessage}
        ></ErrorDialog>
        <Grid columns={1} relaxed="very" stackable>
          <Grid.Column width={12}>
            <div className="row">
              <Dropdown
                button
                className="calendar check"
                floating
                labeled
                icon="world"
                options={this.state.dropDownVlues}
                search
                // text={this.state.selectedValue}
                renderLabel={this.state.selectedValue}
                onChange={this.ChangeDataSet.bind(this)}
              />
            </div>
            <div className="row">
              <Line
                onElementsClick={(element) => {
                  console.log(element[0], 'yyyyyyyyyyyyy');
                }}
                data={this.state.data}
              />
            </div>
          </Grid.Column>
        </Grid>
      </Segment>
    );
  }
}

export default MainAnalytic;

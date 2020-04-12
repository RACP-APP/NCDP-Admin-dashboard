import React from 'react';
import '../../css/component.css';
import '../../css/buttonStyles.css';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import config from '../../config.json';

import { Grid, Segment, Dropdown, Label, Table } from 'semantic-ui-react';

// const AppDwonLoad = require('../../ChartData.json')['appDownload'];

class MainAnalytic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropDownVlues: [],
      selectedValue: '2020',
      data: {},
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
      console.log('hiiiiiiiiiiiiiiiii');
      this.initialValueForChart();
    } else {
      console.log('hiiiiiiiiiiiiiiiii2222222222222222');
      this.getChartForEachMonth(e, value);
    }
  }

  //---------------------------- A func To Creat A Chart For Each Month Selected ----------------------------------//
  getChartForEachMonth(e, value) {
    var labels = [];
    var dataSet = [];
    var count = 1;

    axios.get(config[0].server + 'GetChart').then((result) => {
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
      });
    });
  }
  //--------------------------- do the intial value for the dataset ------------------------------//
  initialValueForChart() {
    var labels = [];
    var datasets = [];
    let count = 0;
    console.log('inside the initialValueForChart ');
    //--------------- get the data -----------------------//
    axios.get(config[0].server + 'GetChart').then((result) => {
      console.log(result.data, 'result');
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
        },
      });
    });
  }

  //--------------------------------------------------------------------------------------------------------//

  componentDidMount() {
    // this.initialValueForChart();

    var dropDownVluesTemp = [{ key: 'Totals', text: '2020', value: 'Totals' }];
    this.initialValueForChart();
    //---------------------------------------------------------------------------------------------------------//
    //--------------- get the data -----------------------//
    axios.get(config[0].server + 'GetChart').then((result) => {
      //---------------------------------------------------------------------------------------------------------//
      for (var Month in result.data['appDownload']) {
        dropDownVluesTemp.push({
          key: Month,
          text: Month,
          value: Month,
        });
      }
      this.setState({
        dropDownVlues: dropDownVluesTemp,
      });
    });
    console.log(this.state.data, 'labels');
  }

  render() {
    return (
      <Segment placeholder>
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

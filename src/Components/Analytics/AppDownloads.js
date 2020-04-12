import React from 'react';
import '../../css/component.css';
import '../../css/buttonStyles.css';
import { Line } from 'react-chartjs-2';

import { Grid, Segment, Dropdown, Label, Table } from 'semantic-ui-react';

const AppDwonLoad = require('../../ChartData.json')['appDownload'];

console.log(AppDwonLoad);
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
      this.setState({
        data: this.initialValueForChart(),
      });
    } else {
      this.getChartForEachMonth(e, value);
    }
  }

  //---------------------------- A func To Creat A Chart For Each Month Selected ----------------------------------//
  getChartForEachMonth(e, value) {
    var labels = [];
    var dataSet = [];
    var count = 1;
    for (var week in AppDwonLoad[value]) {
      for (var i = 0; i < AppDwonLoad[value][week]['days'].length; i++) {
        //-------------------- create Lables and data Array to the data Set ---------------------------------------//
        labels.push(value + '-' + count);
        dataSet.push(AppDwonLoad[value][week]['days'][i]);
        count++;
      }
    }

    var data = {
      labels: labels,
      datasets: [
        { data: dataSet, label: value, backgroundColor: this.random_rgba() },
      ],
      options: {
        title: { text: 'App Downloads ' + value, display: true, fontSize: 25 },
        responsive: true,
      },
    };
    this.setState({
      selectedValue: e.target.textContent,
      data: data,
    });
  }
  //--------------------------- do the intial value for the dataset ------------------------------//
  initialValueForChart() {
    var labels = [];
    var datasets = [];
    let count = 0;
    for (var month in AppDwonLoad) {
      var data = [];
      for (var week in AppDwonLoad[month]) {
        labels = Object.keys(AppDwonLoad[month]);
        data.push(AppDwonLoad[month][week]['tatal']);
      }
      datasets[count] = {
        data: data,
        label: month,
        backgroundColor: this.random_rgba(),
      };

      count++;
    }
    return (data = {
      labels: labels,
      datasets: datasets,
    });
  }

  //--------------------------------------------------------------------------------------------------------//

  componentDidMount() {
    // this.initialValueForChart();
    var dropDownVluesTemp = [{ key: 'Totals', text: '2020', value: 'Totals' }];
    for (var Month in AppDwonLoad) {
      dropDownVluesTemp.push({ key: Month, text: Month, value: Month });
    }
    this.setState({
      dropDownVlues: dropDownVluesTemp,
      data: this.initialValueForChart(),
    });
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

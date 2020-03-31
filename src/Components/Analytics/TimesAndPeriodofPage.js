import React from 'react';
import '../../css/component.css';
import '../../css/buttonStyles.css';
import { Pie } from 'react-chartjs-2';
import { Dropdown, Input } from 'semantic-ui-react';
import { Grid, Segment, Header, Label, Table } from 'semantic-ui-react';

const TimeReviwed = require('./ChartData.json')['TimeReviwed'];

export default class TimesRevied extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropDownVlues: [],
      selectedValue: '2020',
      color: [],
      data: {
        datasets: [
          {
            data: [10, 20, 30]
          }
        ],
        labels: ['Red', 'Yellow', 'Blue']
      }
    };
  }
  //-------------------------------------------------------------------------------//
  //---------------- a function to generate a random Color ------------------------//
  //-------------------------------------------------------------------------------//
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
      //   ',' +
      //   r().toFixed(1) +
      ')'
    );
  }

  //--------------------------------------------------------------------------------------------------------------------//
  //-------------------------- Func to shange dataset for our Chart ----------------------------------------------------//
  //--------------------------------------------------------------------------------------------------------------------//
  getChartForEachModuleTopics(e, { value }) {
    console.log(value);

    this.setState({
      selectedValue: e.target.textContent,
      data: this.ChangeDataSet(value)
    });
  }

  //---------------------------------------------------------------------------------------------------------------------//
  //----------------------------- Creat DataSet for To Hnadel DropDownList Cahang Handler -------------------------------//
  //---------------------------------------------------------------------------------------------------------------------//
  ChangeDataSet(value) {
    var datasets = [];
    var labels = [];
    var backgroundColor = [];
    var data = {};
    for (var i = 0; i < TimeReviwed.length; i++) {
      if (
        TimeReviwed[i]['ModelTitle'] + '-' + TimeReviwed[i]['TopicTiele'] ===
        value
      ) {
        for (var j = 0; j < TimeReviwed[i]['Articles'].length; j++) {
          console.log(TimeReviwed[i]['Articles'][j]['ArticlTitle']);
          labels.push(TimeReviwed[i]['Articles'][j]['ArticlTitle']);
          datasets.push(TimeReviwed[i]['Articles'][j][this.props.filter]);
          backgroundColor.push(this.random_rgba());
        }

        break;
      }
    }
    this.setState({
      color: backgroundColor
    });
    return {
      datasets: [{ data: datasets, backgroundColor: backgroundColor }],
      labels: labels
    };

    //----------------- Implement the functionality and then set the state here --------------------------------------//
  }
  createInfoData() {
    {
      return this.state.data['datasets'][0]['data'].map((item, index) => {
        return (
          <Table.Row>
            <Table.Cell>
              <Header
                as="h4"
                image
                style={{ backgroundColor: '#A52A2A !important' }}
              >
                <div
                  style={{
                    minHeight: '10px',
                    maxHeight: '10px',
                    minWidth: '60px',
                    width: '100%',
                    backgroundColor:
                      this.state.color[index] || 'rgba(195,75,198)'
                  }}
                ></div>

                <Header.Content>
                  <Header.Subheader>
                    {this.state.data['labels'][index]}
                  </Header.Subheader>
                </Header.Content>
              </Header>
            </Table.Cell>
            <Table.Cell>{item}</Table.Cell>
          </Table.Row>
        );
      });
    }
  }
  //------------------------------- Initalize Our States -------------------------//
  componentDidMount() {
    console.log('SecreenReviwes', this.props.filter);
    //-------------------- fill our drop downlist with values -------------------//
    var dropDownVluesTemp = [];
    for (var i = 0; i < TimeReviwed.length; i++) {
      dropDownVluesTemp.push({
        key: TimeReviwed[i]['ModelTitle'] + '-' + TimeReviwed[i]['TopicTiele'],
        text: TimeReviwed[i]['ModelTitle'] + '-' + TimeReviwed[i]['TopicTiele'],
        value: TimeReviwed[i]['ModelTitle'] + '-' + TimeReviwed[i]['TopicTiele']
      });
    }

    this.setState(
      {
        dropDownVlues: dropDownVluesTemp,
        data: this.ChangeDataSet(dropDownVluesTemp[0]['key'])
      },
      () => {
        console.log(this.createInfoData());
      }
    );
  }

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Segment placeholder>
          <Grid columns={2} relaxed="very" stackable>
            <Grid.Column width={10}>
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
                  onChange={this.getChartForEachModuleTopics.bind(this)}
                />
              </div>
              <div className="row">
                <Pie data={this.state.data}></Pie>
              </div>
            </Grid.Column>
            <Grid.Column width={6}>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Article</Table.HeaderCell>
                    <Table.HeaderCell>
                      {this.props.filter === 'TimeViewed'
                        ? 'Reviews'
                        : 'Times spent On a Screen'}
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                {this.createInfoData()}

                <Table.Body></Table.Body>
              </Table>
            </Grid.Column>
          </Grid>
        </Segment>
      </div>
    );
  }
}
import React from 'react';
import '../../css/component.css';
import '../../css/buttonStyles.css';
// import axios from 'axios';
import AppDownload from './AppDownloads';
import SecreenReviwes from './TimesAndPeriodofPage';
import config from '../../config.json';
import { error } from 'mammoth/lib/results';
import { Grid, Label, Segment } from 'semantic-ui-react';

class MainAnalytic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div style={{ paddingBottom: '3%', height: '60%', width: '90%' }}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Segment raised>
                <Label as="a" color="red" ribbon>
                  App Download
                </Label>

                <AppDownload />
              </Segment>
            </Grid.Column>
            <Grid.Column width={8}>
              <Segment raised>
                <Label as="a" color="red" ribbon>
                  Reviwes
                </Label>
                <SecreenReviwes filter="TimeViewed" />
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8}>
              <Segment raised>
                <Label as="a" color="red" ribbon>
                  Time Spend On Screen in min
                </Label>
                <SecreenReviwes filter="TimeSpendOnArticle" />
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default MainAnalytic;

import React from 'react';
import '../../css/component.css';
import '../../css/buttonStyles.css';
import AppDownload from './AppDownloads';
import SecreenReviwes from './TimesAndPeriodofPage';
import { Grid, Label, Segment } from 'semantic-ui-react';

class MainAnalytic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    localStorage.setItem('CurrentnavNode', 'Analytics');
  }
  render() {
    return (
      <div style={{ paddingBottom: '3%', height: '60%', width: '100%' }}>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Segment raised>
                <Label as="a" color="red" ribbon>
                  عدد مرات تنزيل التطبيق
                </Label>

                <AppDownload />
              </Segment>
            </Grid.Column>
            <Grid.Column width={8}>
              <Segment raised>
                <Label as="a" color="red" ribbon>
                  المراجعات
                </Label>
                <SecreenReviwes filter="TimeViewed" />
              </Segment>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8}>
              <Segment raised>
                <Label as="a" color="red" ribbon>
                  الوقت المنقضي على الشاشة بالدقائق
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

import React from 'react';
import '../../css/component.css';
import '../../css/buttonStyles.css';
import data from './FooterData.json';
import config from '../../config.json';
import $ from 'jquery';
import axios from 'axios';
import ErrorMessage from '../../Components/ErroeDialog';

import { Checkbox, Input, Icon, Table, Button } from 'semantic-ui-react';

export default class ManageSocialIcons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      Error: false,
      ErrorMessage: '',
      Updated: false,
      open: false,
      animation: 'slide down',
      duration: 500,
    };
  }

  toggle = (e) => {
    var temp = data;

    var d = $('#' + e.target.id)
      .parent()
      .attr('data-key');
    for (var i = 0; i < temp.length; i++) {
      //   console.log(temp[i]['Icon']);
      if (temp[i]['Icon'].split(' ').join('') === e.target.id) {
        temp[i]['active'] = !temp[i]['active'];
        if (temp[i]['active']) {
          $('#' + d + e.target.id).removeAttr('disabled');
        } else {
          $('#' + d + e.target.id).attr('disabled', 'disabled');
        }
        break;
      }
    }
    this.setState({
      data: temp,
    });
  };

  ChangeLink(e) {
    var temp = this.state.data;
    temp[parseInt(e.target.id[0])]['linke'] = e.target.value;
    this.setState(
      {
        data: temp,
      },
      console.log(this.state.data)
    );
  }

  saveFooterIcons(e) {
    let json = JSON.stringify(this.state.data);
    axios
      .post(config[0].server + 'WriteSocialIconsData', {
        data: this.state.data,
      })
      .then((result) => {
        console.log('done');
        this.setState({
          error: false,
          ErrorMessage: '',
          Updated: true,
          open: false,
        });
      })
      .catch((error) => {
        this.setState({
          error: true,
          ErrorMessage: error.response.data,
          Updated: false,
          open: true,
        });
      });
  }
  componentDidMount() {
    axios
      .get(config[0].server + 'GetFooterJson')
      .then((result) => {
        console.log(result.data, '8888888888888888888888888');
        this.setState({ data: result.data, ErrorMessage: '', open: false });
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
      <div style={{ width: '100%', marginBottom: '5%' }}>
        <ErrorMessage
          open={this.state.open}
          ErrorMessage={this.state.ErrorMessage}
        />

        <h4 class="ui horizontal divider header">
          <i class="tag icon"></i>
          تحرير الرموز الاجتماعية
        </h4>
        {this.state.Error ? (
          <h3 style={{ color: 'red' }}>{this.state.ErrorMessage}</h3>
        ) : null}
        {this.state.Updated ? (
          <h5 style={{ color: 'green' }}>تم تحديث البيانات بنجاح ..</h5>
        ) : null}
        <Table definition>
          <Table.Header>
            <Table.Cell width={1}>أيقونة</Table.Cell>
            <Table.Cell>نشيط</Table.Cell>
            <Table.Cell>الرابط</Table.Cell>
          </Table.Header>
          <Table.Body>
            {this.state.data.map((item, index) => {
              return (
                <Table.Row>
                  <Table.Cell width={1}>
                    <h4 class="ui  header">
                      <Icon name={item['Icon']} />
                    </h4>
                  </Table.Cell>
                  <Table.Cell width={3}>
                    <Checkbox
                      id={item['Icon'].split(' ').join('')}
                      data-key={index}
                      toggle
                      checked={item['active']}
                      onChange={this.toggle}
                    />
                  </Table.Cell>
                  <Table.Cell width={14}>
                    <Input
                      id={index + item['Icon'].split(' ').join('')}
                      style={{ width: '100%' }}
                      icon={item['Icon']}
                      iconPosition="left"
                      placeholder={item['linke']}
                      onChange={this.ChangeLink.bind(this)}
                    />
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
        <Table>
          <Table.Row colSpan="3" style={{ textAlign: 'center' }}>
            <Button primary onClick={this.saveFooterIcons.bind(this)}>
              حفظ
            </Button>
          </Table.Row>
        </Table>
      </div>
    );
  }
}

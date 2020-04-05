import React from 'react';
import '../../css/component.css';
import '../../css/buttonStyles.css';
import data from './FooterData.json';
import config from '../../config.json';
import $ from 'jquery';
import axios from 'axios';
// import fs from 'browserify-fs';
import { Checkbox, Input, Icon, Table, Button } from 'semantic-ui-react';
import { Result } from 'mammoth/lib/results';
// const fs = require('fs');

export default class ManageSocialIcons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: data,
      Error: false,
      ErrorMessage: '',
      Updated: false
    };
  }

  toggle = e => {
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
      data: temp
    });
  };

  ChangeLink(e) {
    var temp = this.state.data;
    temp[parseInt(e.target.id[0])]['linke'] = e.target.value;
    this.setState(
      {
        data: temp
      },
      console.log(this.state.data)
    );
  }

  saveFooterIcons(e) {
    console.log('saveFooterIcons .....................');
    let json = JSON.stringify(this.state.data);
    axios
      .post(config[0].server + 'WriteSocialIconsData', {
        data: this.state.data
      })
      .then(result => {
        console.log('done');
        this.setState({
          error: false,
          ErrorMessage: '',
          Updated: true
        });
      })
      .catch(error => {
        console.log('Error', error);

        this.setState({
          error: true,
          ErrorMessage: error.response.data,
          Updated: false
        });
        console.log(error);
      });
  }

  render() {
    return (
      <div style={{ width: '100%', marginBottom: '5%' }}>
        <h4 class="ui horizontal divider header">
          <i class="tag icon"></i>
          Edite Social Icons
        </h4>
        {this.state.Error ? (
          <h3 style={{ color: 'red' }}>{this.state.ErrorMessage}</h3>
        ) : null}

        {this.state.Updated ? (
          <h5 style={{ color: 'green' }}>
            Data has been Updated Successfuly ..
          </h5>
        ) : null}

        <Table definition>
          <Table.Header>
            <Table.Cell width={1}>Icon</Table.Cell>
            <Table.Cell>Active</Table.Cell>
            <Table.Cell>linke</Table.Cell>
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
              Save
            </Button>
          </Table.Row>
        </Table>
      </div>
    );
  }
}

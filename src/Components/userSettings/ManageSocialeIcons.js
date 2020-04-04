import React from 'react';
import '../../css/component.css';
import '../../css/buttonStyles.css';
import data from './FooterData.json';
import $ from 'jquery';
import { Checkbox, Input, Icon, Table } from 'semantic-ui-react';

export default class ManageSocialIcons extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: data,
      loading: 0
    };
  }

  toggle = e => {
    var temp = data;
    console.log(
      e.target.id,
      $('#' + e.target.id)
        .parent()
        .attr('data-key')
    );
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
        console.log($('#' + d + e.target.id), '#' + d + e.target.id);
        break;
      }
    }
    this.setState({
      data: temp
    });
  };

  ChangeLink(e) {
    console.log(e.target.id, e.target.value, '4444');
    var temp = this.state.data;
    temp[parseInt(e.target.id[0])]['linke'] = e.target.value;
    this.setState(
      {
        data: temp
      },
      console.log(this.state.data)
    );
  }

  render() {
    return (
      <div style={{ width: '100%' }}>
        <h4 class="ui horizontal divider header">
          <i class="tag icon"></i>
          Description
        </h4>

        <Table definition>
          <Table.Header>
            <Table.Cell width={2}>Icon</Table.Cell>
            <Table.Cell>Active</Table.Cell>
            <Table.Cell>linke</Table.Cell>
          </Table.Header>
          <Table.Body>
            {this.state.data.map((item, index) => {
              return (
                <Table.Row>
                  <Table.Cell width={2}>
                    <h4 class="ui  header">
                      <Icon name={item['Icon']} />
                    </h4>
                  </Table.Cell>
                  <Table.Cell width={2}>
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
      </div>
    );
  }
}

import React from 'react';
import config from '../config';
import axios from 'axios';
import { Icon, Table } from 'semantic-ui-react';

class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
  }

  componentDidMount() {
    axios.get(config[0].server + 'GetFooterJson').then((result) => {
      this.setState({
        data: result.data,
      });

      console.log('4444444444444444444444444444', this.state.data);
    });
  }
  render() {
    return (
      <div className=" footer shawBackground borderTop">
        <Table>
          <Table.Row>
            {this.state.data.map((item, i) => {
              if (item.active) {
                // if(item.Icon)
                return (
                  <Table.Cell>
                    <div className="socialicons">
                      <a href={item.linke}>
                        <Icon name={item['Icon']} size="large" />
                      </a>
                    </div>
                  </Table.Cell>
                );
              }
            })}
          </Table.Row>
        </Table>
      </div>
    );
  }
}

export default Footer;

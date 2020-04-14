import React from 'react';
import PropTypes from 'prop-types';

import { Menu } from 'semantic-ui-react';

class TopHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Mainheader " style={{ left: '20px' }}>
        <Menu color={'black'} inverted>
          <Menu.Item>
            <div style={{ minWidth: '30px', minHeight: '40px' }}></div>
            {/* <img
              style={{ borderRadius: '20px' }}
              src={
                JSON.parse(localStorage.getItem('user'))['Image'] ||
                'https://react.semantic-ui.com/logo.png'
              }
            /> */}
          </Menu.Item>

          <Menu.Item
            name="features"
            // active={activeItem === 'features'}
            // onClick={this.handleItemClick}
          >
            Features
          </Menu.Item>

          <Menu.Item
            name="testimonials"
            // active={activeItem === 'testimonials'}
            // onClick={this.handleItemClick}
          >
            Testimonials
          </Menu.Item>

          <Menu.Item
            name="sign-in"
            // active={activeItem === 'sign-in'}
            // onClick={this.handleItemClick}
          >
            Sign-in
          </Menu.Item>
        </Menu>
      </div>
    );
  }
}

export default TopHeader;

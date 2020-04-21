import React from 'react';
import config from '../config.json';
import {
  TransitionablePortal,
  Segment,
  Header,
  Image,
} from 'semantic-ui-react';
class ErrorMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ErrorMessage: this.props.ErrorMessage,
      open: this.props.open,
      animation: 'slide down',
      duration: 500,
    };
  }

  render() {
    console.log('ffffffffffffffffffff');
    return (
      <TransitionablePortal
        open={this.props.open}
        transition={{
          animation: this.state.animation,
          duration: this.state.duration,
        }}
      >
        <Segment
          style={{
            left: '40%',
            position: 'fixed',
            zIndex: 1000,
            top: '15%',
            zIndex: 1000,
            overflow: 'auto',
          }}
        >
          <Header>
            Error
            <Image
              size="tiny"
              src={config[0].server + 'public/vcsconflicting_93497.png'}
            />
          </Header>
          <p>{this.props.ErrorMessage}</p>
        </Segment>
      </TransitionablePortal>
    );
  }
}
export default ErrorMessage;

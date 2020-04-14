import React from 'react';
import '../css/component.css';
import '../css/buttonStyles.css';
import Viwer from './ModelViwer';
import Header from './Header';

class MainDashBoard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viwerSatte: {},
    };

    this.ArrangDashControles = this.ArrangDashControles.bind(this);
  }

  componentDidMount() {
    // console.log('in masin dash board');
  }
  ArrangDashControles(satate) {
    this.setState({
      viwerSatte: satate,
    });
    // console.log(this.state, '--------', satate);
  }
  render() {
    return (
      <div className="row ">
        <div className="row"></div>
        {this.state.viwerSatte['ViwerTitle']}

        <div className="row">
          <Viwer viwerSatte={this.ArrangDashControles.bind(this)} />
        </div>
      </div>
    );
  }
}

export default MainDashBoard;

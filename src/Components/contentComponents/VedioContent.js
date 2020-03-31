import '../../../node_modules/video-react/dist/video-react.css'; // import css

import React from 'react';
import { Player } from 'video-react';

class VedioViwer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row">
        <Player
          className="limit"
          playsInline
          poster="/assets/poster.png"
          src={'https://media.w3.org/2010/05/sintel/trailer_hd.mp4 '}
        />
      </div>
    );
  }
}
export default VedioViwer;

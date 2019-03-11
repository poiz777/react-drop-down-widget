import React, { Component } from 'react';

class Indicator extends Component {

    render() {
      return (
        <span className="pz-drop-down-indicator"
              onClick={(e)=>{ this.props.showAllSuggestions(e) }}>
            <div className="pz-arrow-down" />
        </span>
      );
    }
}

export default Indicator;

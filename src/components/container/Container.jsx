// @flow
import React from 'react';
import { string, oneOfType, array, any } from 'prop-types';

require('./container.css');
// const debug = require('debug')('Container');

class Container extends React.PureComponent {
  render() {
    return (
      <div className="sjakk-main__container">
        {this.props.children}
      </div>
    );
  }
}

Container.propTypes = {
  children: oneOfType([string, array, any]).isRequired,
};

export default Container;

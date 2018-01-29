// @flow

import React from 'react';
import { Link } from 'react-router-dom'

import PropTypes from 'prop-types'; // ES6
import Container from '../container/Container';

const debug = require('debug')('ChoosePath');

require('./choosepath.css');

class ChoosePath extends React.Component {

  componentDidMount() {
    debug('componentDidMount');
  }

  render() {
    return (
      <Container>
        <h1>Hva vil du gjøre?</h1>

        <div>
          <Link className="smallspace button" to="/adduser">Legg til bruker</Link>
          <Link className="smallspace button" to="/tournaments">Turneringer</Link>
          <Link className="smallspace button" to="/statistics">Statistikk</Link>
        </div>
      </Container>
    );
  }
}

ChoosePath.propTypes = {
  router: PropTypes.object,
};

export default ChoosePath;

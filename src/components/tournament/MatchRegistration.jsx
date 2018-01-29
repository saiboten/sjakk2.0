import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import firebase from '../firebase/FirebaseInit';

const debug = require('debug')('MatchRegistration');

class MatchRegistration extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      black: undefined,
      white: undefined,
      date: moment(),
      feedback: '',
    };

    this.submit = this.submit.bind(this);
    this.whiteChanged = this.whiteChanged.bind(this);
    this.blackChanged = this.blackChanged.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({
      black: props.users[0].id,
      white: props.users[0].id
    });
  }

  whiteChanged(e) {
    debug('White changed', e.target.value);
    this.setState({
      white: e.target.value,
      feedback: '',
    });
  }

  blackChanged(e) {
    debug('Black changed', e.target.value);
    this.setState({
      black: e.target.value,
      feedback: '',
    });
  }

  submit(e) {
    e.preventDefault();
    debug('Submit', this.state);

    if (this.state.black === this.state.white) {
      this.setState({
        feedback: 'En spiller kan ikke spille mot seg selv',
      });
    } else {
      this.props.callback({
        white: this.state.white,
        black: this.state.black,
        date: this.state.date.format(),
      });
    }
  }

  render() {
    const options = this.props.users.map(user => (
      (<option key={user.id} value={user.id}>{user.name}</option>)
    ));

    return (<form onSubmit={this.submit}>
      <div className="flex-column space-between smallspace">
        <label className="smallspace" htmlFor="white">Hvit</label><select value={this.state.white} onChange={this.whiteChanged}>
          {options}
        </select>
        <label className="smallspace" htmlFor="black">Svart</label><select value={this.state.black} onChange={this.blackChanged}>
          {options}
        </select>
      </div>
      <input className="button" type="submit" value="Legg til kamp" />
      <p>{this.state.feedback}</p>
    </form>);
  }
}

MatchRegistration.propTypes = {
  callback: PropTypes.func,
  users: PropTypes.array
};

MatchRegistration.defaultProps = {
  users: []
}

export default MatchRegistration;

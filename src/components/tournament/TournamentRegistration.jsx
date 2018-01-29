import React from 'react';
import PropTypes from 'prop-types'; // ES6
import DatePicker from 'react-datepicker';
import moment from 'moment';

import 'react-datepicker/dist/react-datepicker.css';
import firebase from '../firebase/FirebaseInit';

const uuidv1 = require('uuid/v1');
const debug = require('debug')('TournamentRegistration');

class TournamentRegistration extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: '',
      host: '',
      date: moment(),
      users: [],
    };

    this.submit = this.submit.bind(this);
    this.nameChanged = this.nameChanged.bind(this);
    this.hostChanged = this.hostChanged.bind(this);
    this.dateChanged = this.dateChanged.bind(this);
    this.loadUsers = this.loadUsers.bind(this);
  }

  componentDidMount() {
    debug('componentDidMount');
    this.loadUsers();
  }

  componentWillUnmount() {
    debug('componentWillUnmount');
    this.fireBaseUser.off();
  }

  loadUsers() {
    this.fireBaseUser = firebase.database().ref('users');
    this.fireBaseUser.on('value', (snapshot) => {
      debug('Got data: ', snapshot.val());
      if (snapshot.val()) {
        this.setState({
          users: Object.values(snapshot.val()),
        });
      }
    });
  }

  dateChanged(date) {
    debug('date changed, new date: ', date);
    this.setState({
      date,
    });
  }

  nameChanged(e) {
    this.setState({
      name: e.target.value,
    });
  }

  hostChanged(e) {
    debug('New host: ', e.target.value);
    this.setState({
      host: e.target.value,
    });
  }

  submit(e) {
    e.preventDefault();
    this.props.callback({
      date: this.state.date.format(),
      host: this.state.host,
      name: this.state.name,
      id: uuidv1(),
    });
  }

  render() {
    const options = this.state.users.map(user => (
      (<option key={user.id} value={user.id}>{user.name}</option>)
    ));

    return ((<form onSubmit={this.submit}>
      <div className="flex-row space-between smallspace"><label htmlFor="name">Navn</label><input id="name" onChange={this.nameChanged} value={this.state.name} /></div>
      <div className="flex-row space-between smallspace"><label htmlFor="host">Vert</label>
        <select value={this.state.host} onChange={this.hostChanged}>
          {options}
        </select>
      </div>
      <div className="flex-row space-between smallspace"><label htmlFor="date">Dato</label><DatePicker
        id="date"
        selected={this.state.date}
        onChange={this.dateChanged}
      /></div>
      <input className="button" type="submit" value="Legg til" />
    </form>));
  }
}

TournamentRegistration.propTypes = {
  callback: PropTypes.func,
};

export default TournamentRegistration;

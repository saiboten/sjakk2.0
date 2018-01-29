import React from 'react';
import PropTypes from 'prop-types'; // ES6

import firebase from '../firebase/FirebaseInit';

class AddUserForm extends React.Component {

  static nameAdded(data) {
    const user = {
      name: data.name,
      id: data.email.replace(/\./, '-dot-'),
      rating: 1200,
    };

    firebase.database().ref(`users/${user.id}`).set(user);
  }

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
    };

    this.nameChange = this.nameChange.bind(this);
    this.emailChange = this.emailChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  submit(e) {
    e.preventDefault();
    AddUserForm.nameAdded({
      name: this.state.name,
      email: this.state.email,
    });
    this.setState({
      name: '',
      email: '',
    });
  }

  nameChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  emailChange(e) {
    this.setState({
      email: e.target.value,
    });
  }

  render() {
    return (
      <form onSubmit={this.submit}>
        <div className="flex-column space-between smallspace">
          <h1>Legg til ny bruker</h1>
          <label htmlFor="name">Navn</label><input onChange={this.nameChange} id="name" value={this.state.name} />
          <label htmlFor="email">Email</label><input onChange={this.emailChange} id="email" value={this.state.email} />

        </div>
        <input className="button" type="submit" value="Legg til bruker" />
      </form>
    );
  }
}

AddUserForm.propTypes = {
  callback: PropTypes.func,
};

export default AddUserForm;

import React from 'react';

import firebase from '../firebase/FirebaseInit';

const debug = require('debug')('ScoreBoard');

class ScoreBoard extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    firebase.database().ref('users').on('value', (snapshot) => {
      const users = snapshot.val();
      debug('User', users);
      this.setState({
        users: Object.values(users),
      });
    });
  }

  render() {
    let copyList = this.state.users.slice();

    copyList = copyList.sort((a, b) => (
      a.rating < b.rating
    ));

    const scoreboardlist = copyList.filter(user => (user.matches && user.matches.length > 0)).map(user => (
      (<li key={user.id}>{user.name} - {user.rating}</li>)
    ));

    return (
      <div>
        <h1>Ratingoversikt</h1>
        <ul className="flex-column">
          {scoreboardlist}
        </ul>
      </div>);
  }
}

export default ScoreBoard;

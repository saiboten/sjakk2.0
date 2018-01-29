import React from 'react';
import { any, array } from 'prop-types'; // ES6
import { connect } from 'react-redux';

import MatchList from './MatchList';
import MatchRegistration from './MatchRegistration';
import firebase from '../firebase/FirebaseInit';
import Container from '../container/Container';

require('./tournament.css');

const debug = require('debug')('Tournament');
const uuidv1 = require('uuid/v1');

class Tournament extends React.Component {

  static storeMatchInUserList(player, matchId) {
    const whiteMatchesList = firebase.database().ref(`users/${player}/matches`);

    whiteMatchesList.once('value', (snapshot) => {
      debug('Got white matches list: ', snapshot.val());
      if (snapshot.val()) {
        const matches = snapshot.val();
        matches.push(matchId);
        firebase.database().ref(`users/${player}/matches`).set(matches);
      } else {
        const matches = [];
        matches.push(matchId);
        firebase.database().ref(`users/${player}/matches`).set(matches);
      }
    });
  }

  constructor(props) {
    super(props);
    this.addMatch = this.addMatch.bind(this);
    this.setMatchList = this.setMatchList.bind(this);
  }

  static storeNewMatch(newMatch) {
    firebase.database().ref(`matches/${newMatch.id}`).set(newMatch);
  }

  componentWillReceiveProps() {
    const { users } = this.props;
    /* this.setState({
      white: Object.values(users)[0].id,
      black: Object.values(users)[0].id,
    }); */
  }

  setMatchList() {
    if (this.tournamentMatchesIDList && this.allMatches) {
      const matchList = this.tournamentMatchesIDList.map(matchId => (
        this.allMatches[matchId]
      )).filter(match => (match));

      debug('Match list after filtering and stuff', matchList);

      this.setState({
        matches: matchList,
      });
    } else {
      this.setState({
        matches: [],
      });
    }
  }

  addMatch(matchData) {
    debug('New match data: ', matchData);

    const whitePlayer = this.props.users[matchData.white];
    const blackPlayer = this.props.users[matchData.black];

    const newMatch = {
      id: uuidv1(),
      white: whitePlayer.id,
      black: blackPlayer.id,
      tournament: this.props.match.params.id,
    };

    debug('New match data: ', newMatch);

    Tournament.storeMatchInUserList(matchData.white, newMatch.id);
    Tournament.storeMatchInUserList(matchData.black, newMatch.id);
    Tournament.storeNewMatch(newMatch);

    const tournamentMatches = firebase.database().ref(`tournaments/${this.props.match.params.id}/matches`);

    tournamentMatches.once('value', (snapshot) => {
      debug('Got tournament matches list: ', snapshot.val());
      if (snapshot.val()) {
        const matchIdList = snapshot.val();
        matchIdList.push(newMatch.id);
        firebase.database().ref(`tournaments/${this.props.match.params.id}/matches`).set(matchIdList);
      } else {
        const matchIdList = [];
        matchIdList.push(newMatch.id);
        firebase.database().ref(`tournaments/${this.props.match.params.id}/matches`).set(matchIdList);
      }
    });
  }

  render() {

    const { match, tournaments, users, matches } = this.props;

    return (<Container>
      <h1>Registrer kamp</h1>
      <MatchRegistration callback={this.addMatch} users={Object.values(users)} />
      <h1>Kampliste</h1>
      <MatchList
        tournament={match.params.id}
        users={users}
        matches={matches}
        matchesIDs={tournaments[match.params.id] ? tournaments[match.params.id].matches : []}
      />
    </Container>);
  }
}

Tournament.propTypes = {
  match: any,
  matches: array,
  users: any
};

Tournament.defaultProps = {
  match: {},
  matches: {},
  users: {}
}

export default connect(
  ({ users: { users }, matches: { matches }, tournaments: { tournaments }}) => ({
    users,
    matches,
    tournaments
  }),
  dispatch => ({})
)(Tournament);

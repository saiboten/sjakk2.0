import React from 'react';
import PropTypes from 'prop-types'; // ES6
import { connect } from 'react-redux';
import Container from '../container/Container';
import UserMatchesList from './UserMatchesList';

const debug = require('debug')('UserStatistics');

class UserStatistics extends React.Component {
  render() {

    const { matches, tournaments, users, match, user } = this.props;

    const userId = match.params.id;

    let matchesPlayed = 0;
    let wins = 0;
    let losses = 0;
    let ties = 0;
    let winsAsWhite = 0;
    let winsAsBlack = 0;

    if (matches && users && users[userId] && users[userId].matches) {
      let userMatches = users[userId].matches.map(onematch => {
        return matches[onematch]
      });

      userMatches = userMatches.filter(xyz => (xyz && xyz.completed));

      debug('User matches: ', userMatches);

      wins = userMatches.reduce((wonMatches, oneMatch) => {
        let won = 0;
        if (oneMatch.white === userId && oneMatch.whiteWon) {
          won = 1;
        } else if (oneMatch.black === userId && oneMatch.blackWon) {
          won = 1;
        }
        return wonMatches + won;
      }, 0);

      losses = userMatches.reduce((lostMatches, oneMatch) => {
        let lost = 0;
        if (oneMatch.white === userId && oneMatch.blackWon) {
          lost = 1;
        } else if (oneMatch.black === userId && oneMatch.whiteWon) {
          lost = 1;
        }
        return lostMatches + lost;
      }, 0);

      ties = userMatches.reduce((tiedMatches, oneMatch) => (
        tiedMatches + (oneMatch.remis ? 1 : 0)
      ), 0);

      winsAsBlack = userMatches.reduce((gamesTotal, oneMatch) => (
        gamesTotal + (oneMatch.black === userId && oneMatch.blackWon ? 1 : 0)
      ), 0);

      winsAsWhite = userMatches.reduce((gamesTotal, oneMatch) => (
        gamesTotal + (oneMatch.white === userId && oneMatch.whiteWon ? 1 : 0)
      ), 0);

      matchesPlayed = userMatches.length;
    }

    return (
      <Container>
        <h1>Brukerstatistikk for {user.name}</h1>
        <ul className="flex-column">
          <li>Rating: {user.rating}</li>
          <li>Antall kamper: {matchesPlayed}</li>
          <li>Seire: {wins}</li>
          <li>Tap: {losses}</li>
          <li>Remis: {ties}</li>
          <br />
          <li>Seire som hvit: {winsAsWhite}</li>
          <li>Seire som sort: {winsAsBlack}</li>
        </ul>

        <ul>
          <h1>Kamper</h1>
          {users[userId] && users[userId].matches ? <UserMatchesList tournaments={tournaments} matches={matches} users={users} user={userId} /> : ''}
        </ul>

      </Container>);
  }
}

UserStatistics.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  matches: PropTypes.array,
  users: PropTypes.any,
  user: PropTypes.any,
};

UserStatistics.defaultProps = {
  match: {},
  matches: {},
  users: {},
  user: {}
};

export default connect(
  ({ tournaments: { tournaments }, users: { users }, matches: { matches }}, ownProps) => {

    

    return {
    matches,
    users,
    user: users[ownProps.match.params.id],
    tournaments
  }
},
  dispatch => ({})
)(UserStatistics);

import React from 'react';
import PropTypes from 'prop-types';

const debug = require('debug')('UserMatchesList');

const findPlayerCssClass = (white, match) => {
  const youWon = (white && match.whiteWon) || (!white && match.blackWon);
  const youLost = (white && match.blackWon) || (!white && match.whiteWon);

  if (youWon) {
    return 'completedMatch__won';
  } else if (youLost) {
    return 'completedMatch__lost';
  }
  return 'completedMatch__tie';
};

const UserMatchesList = ({ matches, user, users }) => {
  let ratingProgress = [];
  if (users && matches && user) {
    let userMatches = users[user].matches.map(match => (
      matches[match]
    ));

    debug('userMatches', userMatches);
    debug('users', users);

    userMatches = userMatches.filter(oneMatch => (oneMatch && oneMatch.completed));

    ratingProgress = userMatches.map((oneMatch) => {
      debug('match', oneMatch);
      const white = users[oneMatch.white];
      const black = users[oneMatch.black];

      let wonOrLost = 'Uavgjort';

      if ((oneMatch.white === user && oneMatch.whiteWon) || (oneMatch.black === user && oneMatch.blackWon)) {
        wonOrLost = 'Seier';
      } if ((oneMatch.white === user && oneMatch.blackWon) || (oneMatch.black === user && oneMatch.whiteWon)) {
        wonOrLost = 'Tap';
      }

      return (<li className="flex-row smallspace" key={oneMatch.id}>
        <span className={findPlayerCssClass(true, oneMatch)}>
          <div className="flex-column">
            <div className="completedMatch__names">{white.name}</div>
            <div className="completedMatch__rating">{oneMatch.whiteInitialRating + oneMatch.whiteRatingChange} {oneMatch.whiteRatingChange > 0 ? `+${oneMatch.whiteRatingChange}` : oneMatch.whiteRatingChange} </div>
          </div>
        </span>
        <span className={findPlayerCssClass(false, oneMatch)}>
          <div className="flex-column">
            <div className="completedMatch__names">{black.name}</div>
            <div className="completedMatch__rating"> {oneMatch.blackInitialRating + oneMatch.blackRatingChange} {oneMatch.blackRatingChange > 0 ? `+${oneMatch.blackRatingChange}` : oneMatch.blackRatingChange} </div>
          </div>
        </span>
        <span className="space">{wonOrLost}</span>
      </li>);
    });
  }

  return (
    <ul>
      {ratingProgress}
    </ul>);
}

UserMatchesList.propTypes = {
  matches: PropTypes.object,
  users: PropTypes.object,
  user: PropTypes.string,
};

export default UserMatchesList;

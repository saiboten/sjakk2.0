import React from 'react';
import PropTypes from 'prop-types';

import firebase from '../firebase/FirebaseInit';
import MatchHelper from './MatchHelper';

const debug = require('debug')('CompletedMatch');

require('./completedmatch.css');

class CompletedMatch extends React.Component {

  constructor(props) {
    super(props);
    this.deleteMatch = this.deleteMatch.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
    this.cancelConfirmDelete = this.cancelConfirmDelete.bind(this);
    this.restoreUserRatings = this.restoreUserRatings.bind(this);

    this.state = {
      confirmedDelete: false,
    };
  }

  confirmDelete() {
    if (this.state.confirmedDelete) {
      this.deleteMatch();
    }

    debug('Setting confirmedDelete to true');
    this.setState({
      confirmedDelete: true,
    });
  }

  cancelConfirmDelete() {
    debug('Setting confirmedDelete to false');

    this.setState({
      confirmedDelete: false,
    });
  }

  restoreUserRatings() {
    debug(`Finding white user: users/${this.props.match.white}`);
    debug(`Finding black user: users/${this.props.match.black}`);
    firebase.database().ref(`users/${this.props.match.white}`).once('value', (snapshotUser) => {
      const theUser = snapshotUser.val();
      debug('the white user and his previous rating', theUser, theUser.rating, this.props.match.whiteRatingChange);
      theUser.rating -= this.props.match.whiteRatingChange;
      firebase.database().ref(`users/${this.props.match.white}`).set(theUser);
    });

    firebase.database().ref(`users/${this.props.match.black}`).once('value', (snapshotUser) => {
      const theUser = snapshotUser.val();
      debug('the black user and his previous rating', theUser, theUser.rating, this.props.match.blackRatingChange);
      theUser.rating -= this.props.match.blackRatingChange;

      firebase.database().ref(`users/${this.props.match.black}`).set(theUser);
    });
  }

  deleteMatch() {
    firebase.database().ref(`matches/${this.props.match.id}`).once('value', (snapshot) => {
      debug('Deleting match: ', this.props.match.id, 'tournament', this.props.tournament);

      MatchHelper.deleteListElementFromList(`tournaments/${this.props.tournament}/matches`, this.props.match.id);
      MatchHelper.deleteListElementFromList(`users/${this.props.match.white}/matches`, this.props.match.id);
      MatchHelper.deleteListElementFromList(`users/${this.props.match.black}/matches`, this.props.match.id);
      firebase.database().ref(`matches/${this.props.match.id}`).remove();

      if (this.props.match.completed) {
        debug('Match is completed. We need to restore user ratings');
        this.restoreUserRatings();
      }
    });
  }

  findPlayerCssClass(white) {
    const match = this.props.match;

    const youWon = (white && match.whiteWon) || (!white && match.blackWon);
    const youLost = (white && match.blackWon) || (!white && match.whiteWon);

    if (youWon) {
      return 'completedMatch__won';
    } else if (youLost) {
      return 'completedMatch__lost';
    }
    return 'completedMatch__tie';
  }

  render() {
    const match = this.props.match;

    const displayNone = {
      display: 'none',
    };

    let confirmDeleteMatchButton = (<span style={displayNone} />);
    if (this.state.confirmedDelete) {
      confirmDeleteMatchButton = (<button className="button completedMatch__deleteMatch__button" onClick={this.cancelConfirmDelete}>Avbryt</button>);
    }

    return (<li className="flex-row space-between smallspace" key={match.id}>
      <span className={this.findPlayerCssClass(true)}>
        <div className="flex-column">
          <div className="completedMatch__names">{this.props.white.name}</div>
          <div className="completedMatch__rating">{match.whiteInitialRating + match.whiteRatingChange} {match.whiteRatingChange > 0 ? `+${match.whiteRatingChange}` : match.whiteRatingChange} </div>
        </div>
      </span>
      <span className={this.findPlayerCssClass(false)}>
        <div className="flex-column">
          <div className="completedMatch__names">{this.props.black.name}</div>
          <div className="completedMatch__rating"> {match.blackInitialRating + match.blackRatingChange} {match.blackRatingChange > 0 ? `+${match.blackRatingChange}` : match.blackRatingChange} </div>
        </div>
      </span>
      <span className="flex-column space-between"><button className="completedMatch__deleteMatch__button button" onClick={this.confirmDelete}>{this.state.confirmedDelete ? 'Bekreft' : 'Slett'}</button>{confirmDeleteMatchButton}</span></li>);
  }
}

CompletedMatch.propTypes = {
  match: PropTypes.object,
  white: PropTypes.object,
  black: PropTypes.object,
  tournament: PropTypes.string,
};

export default CompletedMatch;

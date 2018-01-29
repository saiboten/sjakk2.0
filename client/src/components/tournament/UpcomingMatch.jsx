import React from 'react';
import PropTypes from 'prop-types';

import firebase from '../firebase/FirebaseInit';
import ScoreCalculator from './ScoreCalculator';
import MatchHelper from './MatchHelper';

const debug = require('debug')('UpcomingMatch');

require('./upcomingmatch.css');

class UpcomingMatch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      winner: 'white',
      remisConfirmed: false,
      whiteWonConfirmed: false,
      blackWonConfirmed: false,
      confirmedDelete: false,
    };

    this.storeWinner = this.storeWinner.bind(this);
    this.remisConfirm = this.remisConfirm.bind(this);
    this.blackWon = this.blackWon.bind(this);
    this.whiteWon = this.whiteWon.bind(this);
    this.cancelConfirmDelete = this.cancelConfirmDelete.bind(this);
    this.confirmDelete = this.confirmDelete.bind(this);
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

  remisConfirm() {
    if (this.state.remisConfirmed) {
      this.storeWinner('remis');
    }
    this.setState({
      remisConfirmed: true,
      whiteWonConfirmed: false,
      blackWonConfirmed: false,
    });
  }

  blackWon() {
    if (this.state.blackWonConfirmed) {
      this.storeWinner('black');
    }
    this.setState({
      blackWonConfirmed: true,
      whiteWonConfirmed: false,
      remisConfirmed: false,
    });
  }

  whiteWon() {
    if (this.state.whiteWonConfirmed) {
      this.storeWinner('white');
    }
    this.setState({
      whiteWonConfirmed: true,
      blackWonConfirmed: false,
      remisConfirmed: false,
    });
  }

  storeWinner(winner) {
    debug('Winner is ', winner);
    ScoreCalculator.calculateScore(this.props.white, this.props.black, this.props.match, winner);
  }

  deleteMatch() {
    firebase.database().ref(`matches/${this.props.match.id}`).once('value', (snapshot) => {
      debug('Deleting match: ', this.props.match.id, 'tournament', this.props.tournament);

      MatchHelper.deleteListElementFromList(`tournaments/${this.props.tournament}/matches`, this.props.match.id);
      MatchHelper.deleteListElementFromList(`users/${this.props.match.white}/matches`, this.props.match.id);
      MatchHelper.deleteListElementFromList(`users/${this.props.match.black}/matches`, this.props.match.id);
      firebase.database().ref(`matches/${this.props.match.id}`).remove();
    });
  }

  render() {
    const match = this.props.match;

    debug('this.props.white: ', this.props.white);

    let renderThis = (<li>Laster</li>);

    const displayNone = {
      display: 'none',
    };

    let confirmDeleteMatchButton = (<span style={displayNone} />);

    if (this.state.confirmedDelete) {
      confirmDeleteMatchButton = (<button className="button" onClick={this.cancelConfirmDelete}>N</button>);
    }

    if (this.props.white) {
      renderThis = (
        <li className="flex-row space-between smallspace" key={match.id}>
          <button className={this.state.whiteWonConfirmed ? 'completedMatch__won upcomingMatch__player__button' : 'completedMatch__tie upcomingMatch__player__button'} onClick={this.whiteWon}>
            <div className="flex-column">
              <div className="completedMatch__names">{this.props.white.name}</div>
              <div className="completedMatch__rating">{this.props.white.rating} </div>
            </div>
          </button>
          <button className={this.state.blackWonConfirmed ? 'completedMatch__won upcomingMatch__player__button' : 'completedMatch__tie upcomingMatch__player__button'} onClick={this.blackWon}>
            <div className="flex-column">
              <div className="completedMatch__names">{this.props.black.name}</div>
              <div className="completedMatch__rating"> {this.props.black.rating}</div>
            </div>
          </button>
          <button className="flex-column button upcomingMatch__remis_button" onClick={this.remisConfirm}>{this.state.remisConfirmed ? 'Bekreft' : 'Remis'}</button>
          <span className="flex-column"><button className="button" onClick={this.confirmDelete}>{this.state.confirmedDelete ? 'Y' : 'X'}</button>{confirmDeleteMatchButton}</span>

        </li>);
    }

    return renderThis;
  }
}

UpcomingMatch.propTypes = {
  match: PropTypes.object,
  white: PropTypes.object,
  black: PropTypes.object,
  tournament: PropTypes.string,
};

export default UpcomingMatch;

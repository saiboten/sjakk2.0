import firebase from '../firebase/FirebaseInit';

const debug = require('debug')('ScoreCalculator');
const EloRank = require('elo-rank');

const elo = new EloRank();


class ScoreCalculator {
  static calculateScore(white, black, match, winner) {
    debug('Calculating score based on the following input: ', white, black, match, winner);

    const updatedObject = Object.assign({}, match);

    updatedObject.completed = true;

    updatedObject.whiteInitialRating = white.rating;
    updatedObject.blackInitialRating = black.rating;

    const expectedScoreWhite = elo.getExpected(white.rating, black.rating);
    const expectedScoreBlack = elo.getExpected(black.rating, white.rating);
    let newRatingWhite = -1;
    let newRatingBlack = -1;

    if (winner === 'white') {
      updatedObject.whiteWon = true;
      newRatingWhite = elo.updateRating(expectedScoreWhite, 1, white.rating);
      newRatingBlack = elo.updateRating(expectedScoreBlack, 0, black.rating);
    } else if (winner === 'black') {
      updatedObject.blackWon = true;
      newRatingWhite = elo.updateRating(expectedScoreWhite, 0, white.rating);
      newRatingBlack = elo.updateRating(expectedScoreBlack, 1, black.rating);
    } else {
      updatedObject.remis = true;
      newRatingWhite = elo.updateRating(expectedScoreWhite, 0.5, white.rating);
      newRatingBlack = elo.updateRating(expectedScoreBlack, 0.5, black.rating);
    }

    updatedObject.blackRatingChange = newRatingBlack - black.rating;
    updatedObject.whiteRatingChange = newRatingWhite - white.rating;

    debug('Updated object: ', updatedObject);

    firebase.database().ref(`matches/${match.id}`).set(updatedObject);
    firebase.database().ref(`users/${white.id}`).update({
      rating: newRatingWhite,
    });

    firebase.database().ref(`users/${black.id}`).update({
      rating: newRatingBlack,
    });
  }
}

export default ScoreCalculator;

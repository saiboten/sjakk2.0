import firebase from '../firebase/FirebaseInit';

const debug = require('debug')('ScoreCalculator');

const getExpected = (a, b) => {
  return 1/(1+Math.pow(10,((b-a)/400)));
}
const updateRating = (expected, actual, current) => {
  return Math.round(current+ this.k*(actual-expected));
}

class ScoreCalculator {
  static calculateScore(white, black, match, winner) {
    debug('Calculating score based on the following input: ', white, black, match, winner);

    const updatedObject = Object.assign({}, match);

    updatedObject.completed = true;

    updatedObject.whiteInitialRating = white.rating;
    updatedObject.blackInitialRating = black.rating;

    const expectedScoreWhite = getExpected(white.rating, black.rating);
    const expectedScoreBlack = getExpected(black.rating, white.rating);
    let newRatingWhite = -1;
    let newRatingBlack = -1;

    if (winner === 'white') {
      updatedObject.whiteWon = true;
      newRatingWhite = updateRating(expectedScoreWhite, 1, white.rating);
      newRatingBlack = updateRating(expectedScoreBlack, 0, black.rating);
    } else if (winner === 'black') {
      updatedObject.blackWon = true;
      newRatingWhite = updateRating(expectedScoreWhite, 0, white.rating);
      newRatingBlack = updateRating(expectedScoreBlack, 1, black.rating);
    } else {
      updatedObject.remis = true;
      newRatingWhite = updateRating(expectedScoreWhite, 0.5, white.rating);
      newRatingBlack = updateRating(expectedScoreBlack, 0.5, black.rating);
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

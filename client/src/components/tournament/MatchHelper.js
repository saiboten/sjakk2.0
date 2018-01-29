import firebase from '../firebase/FirebaseInit';

const debug = require('debug')('MatchHelper');

class MatchHelper {
  static deleteListElementFromList(ref, itemid) {
    debug('Deleting match from users matchlist - ref', ref, '. itemid: ', itemid);
    firebase.database().ref(ref).once('value', (snapshot) => {
      const matchListWhite = snapshot.val();
      if(matchListWhite) {
        const index = matchListWhite.indexOf(itemid);
        if (index !== -1) {
          debug('Found match to delete', matchListWhite, index);
          matchListWhite.splice(index, 1);
          firebase.database().ref(ref).set(matchListWhite);
        }
      }
    });
  }
}

export default MatchHelper;

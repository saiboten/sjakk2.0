import React from 'react';
import PropTypes from 'prop-types'; // ES6

import {
  Link,
} from 'react-router-dom';


class TournamentList extends React.Component {

  render() {
    return (
      <ul className="flex-column">
        {this.props.tournaments.map(tournament => (

          <Link
            key={tournament.host}
            className="smallspace button"
            to={`/tournament/${tournament.id}`
          }
          >
            {tournament.name}
          </Link>
       ))}
      </ul>);
  }
}

TournamentList.propTypes = {
  tournaments: PropTypes.array,
};

export default TournamentList;

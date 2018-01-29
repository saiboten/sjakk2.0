import React from 'react';
import { array, any, string } from 'prop-types';

import UpcomingMatch from './UpcomingMatch';
import CompletedMatch from './CompletedMatch';

// const debug = require('debug')('MatchList');

class MatchList extends React.Component {

  render() {
    const matchList = this.props.matchesIDs.map((matchID) => {
      let matchJsx;

      const match = this.props.matches[matchID];

      if(match) {
        if (match.completed) {
          matchJsx = (<CompletedMatch tournament={this.props.tournament} white={this.props.users[match.white]} black={this.props.users[match.black]} key={match.id} match={match} />);
        } else {
          matchJsx = (<UpcomingMatch tournament={this.props.tournament} white={this.props.users[match.white]} black={this.props.users[match.black]} key={match.id} match={match} />);
        }
        return matchJsx;
      }

      return undefined;
    });

    return (
      <ul className="smallspace">
        {matchList}
      </ul>
    );
  }
}

MatchList.propTypes = {
  matches: any,
  users: any,
  tournament: string,
  matchesIDs: array
};

MatchList.defaultProps = {
  matchesIDs: [],
  matches: {}
}

export default MatchList;

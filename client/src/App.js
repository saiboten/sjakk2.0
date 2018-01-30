// @flow
import React from 'react';

import { Route } from 'react-router';
import moment from 'moment';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux'
import createHistory from 'history/createBrowserHistory'

import { Provider } from 'react-redux'
import { ConnectedRouter, routerReducer, routerMiddleware } from 'react-router-redux'

import Login from './components/login/Login';
import TournamentPage from './components/tournament/TournamentPage';
import ChoosePath from './components/choosepath/ChoosePath';
import { UserPageWrapper } from './components/users/UsersPageWrapper';
import Tournament from './components/tournament/Tournament';
import UserStatistics from './components/users/UserStatistics';
import firebase from './components/firebase/FirebaseInit';
import { setUsers } from './state/actions/user';
import { setTournaments } from './state/actions/tournaments';
import { setMatches } from './state/actions/matches';
import { tournaments, matches, users } from './state/reducers';

const history = createHistory()

const middleware = routerMiddleware(history)

/* eslint-disable no-underscore-dangle */
let store = createStore(
  combineReducers(
    {
      tournaments,
      matches,
      users,
      routing: routerReducer
    }
  ),
  compose(applyMiddleware(middleware)), window.navigator.userAgent.includes('Chrome') ?
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() : compose,
  //compose(applyMiddleware(middleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);
/* eslint-enable */

require('./global.css');
/*eslint-disable */
require('babel-polyfill');
/*eslint-enable */

moment.locale('nb_NO');

const debug = require('debug')('App');

firebase.database().ref('users').on('value', (snapshot) => {
  if (snapshot.val()) {
    debug('User value in db: ', snapshot.val());
    store.dispatch(setUsers(snapshot.val()));
  }
});

firebase.database().ref('matches').on('value', (snapshot) => {
  if (snapshot.val()) {
    debug('User value in db: ', snapshot.val());
    store.dispatch(setMatches(snapshot.val()));
  }
});

firebase.database().ref('tournaments').on('value', (snapshot) => {
  if (snapshot.val()) {
    debug('User value in db: ', snapshot.val());
    store.dispatch(setTournaments(snapshot.val()));
  }
});

const App = () => (
  <Provider store={store}>  
    <ConnectedRouter history={history}>
      <div>
        <Route path="/" component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/choosepath" component={ChoosePath} />
        <Route path="/tournaments" component={TournamentPage} />
        <Route path="/users" component={UserPageWrapper} />
        <Route path="/tournament/:id" component={Tournament} />
        <Route path="/user/:id" component={UserStatistics} />
      </div>
    </ConnectedRouter>
  </Provider>
);

export default App;

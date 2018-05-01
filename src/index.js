import React from 'react';
import ReactDOM from 'react-dom';

import makeActions from './data/actions';
import makeStateStream from './data/state';
import makeEvents from './data/events';
import makeApp from './app/';

const events = makeEvents();
const actions = makeActions(events, window);
const state = makeStateStream(actions);
const App = makeApp(state, actions, events);

ReactDOM.render(
  <App/>,
  document.getElementById('app')
);

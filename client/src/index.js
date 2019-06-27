import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import React from 'react'
import { store, history } from './store'
import agent from './agent'

import { Route, Switch } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'

import App from './components/App'

// we always will hit "IF" branch during Cypress tests
// so we should ignore "ELSE" branch for code coverage purposes
// https://github.com/gotwarlost/istanbul/blob/master/ignoring-code-for-coverage.md
/* istanbul ignore else */
if (window.Cypress) {
  window.store = store
  window.agent = agent
}

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route path='/' component={App} />
      </Switch>
    </ConnectedRouter>
  </Provider>,

  document.getElementById('root')
)

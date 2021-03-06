import React from 'react';
import ReactDOM from 'react-dom';
import createHistory from 'history/createBrowserHistory';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import { reducer as formReducer } from 'redux-form';
import {
  ConnectedRouter,
  routerReducer,
  routerMiddleware
} from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import { reducers, sagaWatchers } from 'public-modules';
import explorerSagas from './sagas';
import baseReducers from './reducers';
import { App } from 'layout';
import 'styles/index.scss';
import 'styles/flexboxgrid.css';
import 'font-files/inter-ui.css';
import 'styles/index.scss';
import 'fontAwesome';
import 'styles/Toastify.scss';

const history = createHistory();
const middleware = routerMiddleware(history);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers({
    router: routerReducer,
    form: formReducer,
    ...reducers,
    ...baseReducers
  }),
  composeEnhancers(applyMiddleware(middleware, sagaMiddleware))
);

[...sagaWatchers, ...explorerSagas].map(saga =>
  sagaMiddleware.run(saga, store.dispatch)
);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App />
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
);

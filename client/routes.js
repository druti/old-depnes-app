/* eslint-disable global-require */
import React from 'react';
import { Route, IndexRoute } from 'react-router';

import AuthService from './util/AuthService'
import App from './modules/App/App';

import { toggleMakeMode } from './modules/Post/PostActions';

// require.ensure polyfill for node
if (typeof require.ensure !== 'function') {
  require.ensure = function requireModule(deps, callback) {
    callback(require);
  };
}

/* Workaround for async react routes to work with react-hot-reloader till
  https://github.com/reactjs/react-router/issues/2182 and
  https://github.com/gaearon/react-hot-loader/issues/288 is fixed.
 */
if (process.env.NODE_ENV !== 'production') {
  // Require async routes only in development for react-hot-reloader to work.
  require('./modules/Post/pages/PostListPage/PostListPage');
  require('./modules/Post/pages/PostPage/PostPage');
}


const auth = new AuthService();

/*
// validate authentication for private routes
const requireAuth = (nextState, replace) => {
  if (!auth.loggedIn()) {
    replace({ pathname: '/login' })
  }
}
*/

// react-router setup with code-splitting
// More info: http://blog.mxstbr.com/2016/01/react-apps-with-pages/
export default function getRoutes(store) {
  const exitMakeMode = () => {
    const state = store.getState();
    if (state.posts.navigator.makeMode) {
      store.dispatch(toggleMakeMode());
    }
  };

  return (
    <Route path='/' component={App} auth={auth}>
      <IndexRoute
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Post/pages/PostListPage/PostListPage').default);
          });
        }}
      />
      <Route
        path='/paths'
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Post/pages/PostListPage/PostListPage').default);
          });
        }}
      />
      <Route
        path='/paths/:cuid'
        onLeave={exitMakeMode}
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Post/pages/PostPage/PostPage').default);
          });
        }}
      />
      <Route
        path='*'
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Error/pages/404/404').default);
          });
        }}
      />
    </Route>
  );
}

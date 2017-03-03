/* eslint-disable global-require */
import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './modules/App/App';

import { toggleMakeMode } from './modules/Post/PostActions';
import { getPost } from './modules/Post/PostReducer';

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


// react-router setup with code-splitting
// More info: http://blog.mxstbr.com/2016/01/react-apps-with-pages/
export default function getRoutes(store) {
  const checkForBlank = (nextState, replace) => {
    const isServer = typeof window === 'undefined'
    if (isServer) {
      return
    }

    const reduxState = store.getState();
    const cuid = nextState.params.cuid;
    const path = getPost(reduxState, cuid);
    if (!path || cuid === 'blank') {
      store.dispatch(toggleMakeMode());
      if (cuid !== 'blank') {
        replace('/paths/blank');
      }
    }
  };

  const exitMakeMode = () => {
    const state = store.getState();
    if (state.posts.navigator.makeMode) {
      store.dispatch(toggleMakeMode());
    }
  };

  return (
    <Route path='/' component={App}>
      <IndexRoute
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Post/pages/PostListPage/PostListPage').default);
          });
        }}
      />
      <Route
        path='/login'
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/App/pages/Login/LoginPage').default);
          });
        }}
      />
      <Route
        path='/register'
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/App/pages/Register/RegisterPage').default);
          });
        }}
      />
      <Route
        path='/user'
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/App/pages/User/UserPage').default);
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
        onEnter={checkForBlank}
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

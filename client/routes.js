/* eslint-disable global-require */
import React from 'react';
import { Route, IndexRoute } from 'react-router';

import App from './modules/App/App';

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
export default function getRoutes() {
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
            cb(null, require('./modules/Auth/pages/Login/LoginPage').default);
          });
        }}
      />
      <Route
        path='/signup'
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/Auth/pages/Register/RegisterPage').default);
          });
        }}
      />
      <Route
        path='/user/:sid'
        getComponent={(nextState, cb) => {
          require.ensure([], require => {
            cb(null, require('./modules/User/pages/ProfilePage/ProfilePage').default);
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
        path='/paths/:sid'
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

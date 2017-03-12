/**
 * Root Reducer
 */
import { combineReducers } from 'redux';

// Import Reducers
import auth from './modules/Auth/AuthReducer';
import { reducer as form } from 'redux-form';
import users from './modules/User/UserReducer';
import posts from './modules/Post/PostReducer';
import intl from './modules/Intl/IntlReducer';

// Combine all reducers into one root reducer
export default combineReducers({
  auth,
  form,
  users,
  posts,
  intl,
});

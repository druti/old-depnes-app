import { getCurrentUser } from '../Auth/AuthReducer';

import {
  REQUEST_USER,
  RECEIVE_USER,
  REQUEST_USERS,
  RECEIVE_USERS,
} from './UserActions';

const initState = {
  data: [],
  isFetching: false,
  hasFetched: false,
};

const UserReducer = (state = initState, action) => {
  switch (action.type) {
    case REQUEST_USER :
      return {
        ...state,
        isFetching: true,
        hasFetched: false,
      };

    case RECEIVE_USER :
      return {
        ...state,
        hasFetched: true,
        isFetching: false,
        data: action.user ? [...state.data, action.user] : state.data,
      };

    default:
      return state;
  }
};

export const isFetching = state => state.users.isFetching;
export const hasFetched = state => state.users.hasFetched;

export const getUser = (state, sid) => {
  const currentUser = getCurrentUser(state);
  if (currentUser && currentUser.sid === sid) {
    return currentUser;
  }
  return state.users.data.filter(user => user.sid === sid)[0];
};

// Export Reducer
export default UserReducer;

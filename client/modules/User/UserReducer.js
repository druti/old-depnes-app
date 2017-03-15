import { getCurrentUser } from '../Auth/AuthReducer';

import {
  USER_REQUEST,
  USER_RECEIVE,
  USER_FAILURE,
} from './UserActions';

const initState = {
  data: [],
  awaiting: {},
  failed: {},
};

const UserReducer = (state = initState, action) => {
  switch (action.type) {
    case USER_REQUEST :
      return {
        ...state,
        awaiting: updateAwaiting(state, action, true),
      };

    case USER_RECEIVE :
      return {
        ...state,
        awaiting: updateAwaiting(state, action, false),
        data: action.user ? [...state.data, action.user] : state.data,
      };

    case USER_FAILURE :
      return {
        ...state,
        failed: updateFailed(state, action),
      };

    default:
      return state;
  }
};

function updateAwaiting(state, action, awaiting) {
  return {
    ...state.awaiting,
    [action.requestName]: awaiting,
  };
}

function updateFailed(state, action) {
  return {
    ...state.failed,
    [action.requestName]: {
      message: action.message,
    },
  };
}

export const getAwaiting = state => state.posts.awaiting;

export const getFailed = state => state.posts.failed;

export const getUser = (state, sid) => {
  const currentUser = getCurrentUser(state);
  if (currentUser && currentUser.sid === sid) {
    return currentUser;
  }
  return state.users.data.filter(user => user.sid === sid)[0];
};

export default UserReducer;

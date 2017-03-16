import callApi from '../../util/apiCaller';
import { getUser } from './UserReducer';

export const USER_CACHED = 'USER_CACHED';
export const USER_REQUEST = 'USER_REQUEST';
export const USER_RECEIVE = 'USER_RECEIVE';
export const USER_FAILURE = 'USER_FAILURE';

export const USERS_REQUEST = 'USERS_REQUEST';
export const USERS_RECEIVE = 'USERS_RECEIVE';
export const USERS_FAILURE = 'USERS_FAILURE';

export function fetchUser(sid) {
  return (dispatch, getState) => {
    if (getUser(getState(), sid))  {
      return dispatch(cachedUser(fetchUser.name));
    } else {
      dispatch(requestUser(fetchUser.name));
    }
    return callApi(`user/${sid}`)
      .then(
        res => {
          dispatch(receiveUser(fetchUser.name, res.user))
        },
        err => {
          dispatch(failedRequestUser(fetchUser.name, err.reason));
        }
      );
  };
}

export function cachedUser(requestName) {
  return {
    type: USER_CACHED,
    requestName,
  };
}

export function requestUser(requestName) {
  return {
    type: USER_REQUEST,
    requestName,
  };
}

export function receiveUser(requestName, user) {
  return {
    type: USER_RECEIVE,
    requestName,
    user,
  };
}

export function failedRequestUser(requestName, reason) {
  return {
    type: USER_FAILURE,
    requestName,
    reason,
  };
}

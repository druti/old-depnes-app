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
    const cachedUser = getUser(getState(), sid);
    if (cachedUser)  {
      dispatch(userCached(fetchUser.name));
      return Promise.resolve({ user: cachedUser });
    } else {
      dispatch(requestUser(fetchUser.name));
    }
    return callApi(`user/${sid}`)
      .then(
        res => {
          dispatch(receiveUser(fetchUser.name, res.user))
          return Promise.resolve(res);
        },
        err => {
          dispatch(failedRequestUser(fetchUser.name, err.reason));
          return Promise.reject(err);
        }
      );
  };
}

export function userCached(requestName) {
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

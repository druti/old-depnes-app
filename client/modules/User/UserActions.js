import callApi from '../../util/apiCaller';
import { getUser } from './UserReducer';

export const REQUEST_USER = 'REQUEST_USER';
export const RECEIVE_USER = 'RECEIVE_USER';
export const REQUEST_USERS = 'REQUEST_USERS';
export const RECEIVE_USERS = 'RECEIVE_USERS';

export function fetchUser(sid) {
  return (dispatch, getState) => {
    const cachedUser = getUser(getState(), sid);
    if (cachedUser) return;
    dispatch(requestUser());
    return callApi(`user/${sid}`)
      .then(res => {
        dispatch(receiveUser(res.user))
      });
  };
}

export function requestUser() {
  return {
    type: REQUEST_USER,
  };
}

export function receiveUser(user) {
  return {
    type: RECEIVE_USER,
    user,
  };
}

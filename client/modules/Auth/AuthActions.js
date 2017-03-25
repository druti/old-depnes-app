import { browserHistory } from 'react-router';
import cookie from 'react-cookie';
import callApi from '../../util/apiCaller';
import { setRedirectUrl } from '../App/AppActions';

// Export Constants
export const
  AUTH_USER = 'AUTH_USER',
  UNAUTH_USER = 'UNAUTH_USER',
  AUTH_ERROR = 'AUTH_ERROR',
  AUTH_ERROR_RESET = 'AUTH_ERROR_RESET',
  FORGOT_PASSWORD_REQUEST = 'FORGOT_PASSWORD_REQUEST',
  RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST',
  PROTECTED_TEST = 'PROTECTED_TEST';


export function logInUser({ email, password }, redirectUrl) {
  return function (dispatch) {
    return callApi('auth/login', 'POST', { email, password })
      .then(
        data => {
          cookie.save('token', data.token, { path: '/' });
          cookie.save('user', data.user, { path: '/' });
          dispatch({ type: AUTH_USER, user: data.user});
          browserHistory.push(redirectUrl || `/user/${data.user.sid}`);
          dispatch(setRedirectUrl(''))
        },
        err => {
          dispatch({ type: AUTH_ERROR, reason: err.reason});
        }
      );
  }
}

export function registerUser({ email, firstName, lastName, password }) {
  return function (dispatch) {
    return callApi('auth/register', 'POST', { email, firstName, lastName, password })
      .then(
        data => {
          cookie.save('token', data.token, { path: '/' });
          cookie.save('user', data.user, { path: '/' });
          dispatch({ type: AUTH_USER, user: data.user});
          browserHistory.push(`/user/${data.user.sid}`);
        },
        err => {
          dispatch({ type: AUTH_ERROR, reason: err.reason});
        }
      );
  }
}

export function logOutUser() {
  return function (dispatch) {
    dispatch({ type: UNAUTH_USER });
    cookie.remove('token', { path: '/' });
    cookie.remove('user', { path: '/' });

    browserHistory.push('/');
  }
}

export function errorReset() {
  return {
    type: AUTH_ERROR_RESET,
  };
}

export function protectedTest() {
  return function (dispatch) {
    return callApi('protected', 'GET', undefined, true)
      .then(
        data => {
          dispatch({
            type: PROTECTED_TEST,
            payload: data.content,
          });
        },
        err => {
          dispatch({ type: AUTH_ERROR, reason: err.reason});
        }
      )
  }
}

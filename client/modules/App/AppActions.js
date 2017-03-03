import { browserHistory } from 'react-router';
import cookie from 'react-cookie';
import callApi from '../../util/apiCaller';

// Export Constants
export const
  AUTH_USER = 'AUTH_USER',
  UNAUTH_USER = 'UNAUTH_USER',
  AUTH_ERROR = 'AUTH_ERROR',
  FORGOT_PASSWORD_REQUEST = 'FORGOT_PASSWORD_REQUEST',
  RESET_PASSWORD_REQUEST = 'RESET_PASSWORD_REQUEST',
  PROTECTED_TEST = 'PROTECTED_TEST';

// Export Actions
export function errorHandler(dispatch, error, type) {
  let errorMessage = '';

  if (error.data.error) {
    errorMessage = error.data.error;
  } else if (error.data) {
    errorMessage = error.data;
  } else {
    errorMessage = error;
  }

  if (error.status === 401) {
    dispatch({
      type,
      payload: 'You are not authorized to do this BITCH. Please login and try again.',
    });
    logoutUser();
  } else {
    dispatch({
      type,
      payload: errorMessage,
    });
  }
}

export function loginUser({ email, password }) {
  return function (dispatch) {
    callApi('/auth/login', 'post', { email, password })
      .then(response => {
        cookie.save('token', response.data.token, { path: '/' });
        dispatch({ type: AUTH_USER, user: response.data.user});
        browserHistory.push('/user');
      })
      .error(err => {
        errorHandler(dispatch, err.response, AUTH_ERROR);
      });
  }
}

export function registerUser({ email, firstName, lastName, password }) {
  return function (dispatch) {
    callApi('/auth/register', 'post', { email, firstName, lastName, password })
      .then(response => {
        cookie.save('token', response.data.token, { path: '/' });
        dispatch({ type: AUTH_USER, user: response.data.user});
        browserHistory.push('/user');
      })
      .catch(err => {
        errorHandler(dispatch, err.response, AUTH_ERROR);
      });
  }
}

export function logoutUser() {
  return function (dispatch) {
    dispatch({ type: UNAUTH_USER });
    cookie.remove('token', { path: '/' });

    browserHistory.push('/login');
  }
}

export function protectedTest() {
  return function (dispatch) {
    callApi('/protected', 'get', null, true)
      .then(res => {
        dispatch({
          type: PROTECTED_TEST,
          payload: res.data.content,
        });
      })
      .catch(err => {
        errorHandler(dispatch, err.response, AUTH_ERROR);
      });
  }
}

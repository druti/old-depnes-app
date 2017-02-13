import fetch from 'isomorphic-fetch';
import Config from '../../server/config';
//import AuthService from './AuthService';

//const auth = new AuthService();

export const API_URL = (typeof window === 'undefined' || process.env.NODE_ENV === 'test') ?
  process.env.BASE_URL || (`http://localhost:${process.env.PORT || Config.port}/api`) :
  '/api';

export default function callApi(endpoint, method = 'get', body) {
  const headers = {
    'content-type': 'application/json',
  };

  //if (auth.loggedIn()) {
  // headers['authorization'] = 'Bearer ' + auth.getToken();
  //}

  return fetch(`${API_URL}/${endpoint}`, {
    headers,
    method,
    body: JSON.stringify(body),
  })
  .then(response => response.json().then(json => ({ json, response })))
  .then(({ json, response }) => {
    if (!response.ok) {
      return Promise.reject(json);
    }

    return json;
  })
  .then(
    response => response,
    error => error
  );
}

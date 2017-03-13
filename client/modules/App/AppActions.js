export const SET_REDIRECT_URL = 'SET_REDIRECT_URL';

export function setRedirectUrl(url) {
  return {
    type: SET_REDIRECT_URL,
    url,
  };
}

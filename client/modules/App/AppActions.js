export const LOADING = 'LOADING';
export const SET_REDIRECT_URL = 'SET_REDIRECT_URL';

export function loading(isLoading) {
  return {
    type: LOADING,
    isLoading,
  };
}

export function setRedirectUrl(url) {
  return {
    type: SET_REDIRECT_URL,
    url,
  };
}

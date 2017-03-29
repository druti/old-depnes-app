export const DIALOG_OPEN = 'DIALOG_OPEN';
export const DIALOG_CLOSE = 'DIALOG_CLOSE';
export const LOADING = 'LOADING';
export const SET_REDIRECT_URL = 'SET_REDIRECT_URL';

export function openDialog({ title, message, id = (Math.random()+'').slice(2) }) {
  return {
    type: DIALOG_OPEN,
    title,
    message,
    id,
  };
}

export function closeDialog(id) {
  return {
    type: DIALOG_CLOSE,
    id,
  };
}

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

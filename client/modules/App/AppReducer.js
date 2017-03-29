// Import Actions
import {
  DIALOG_OPEN,
  DIALOG_CLOSE,
  LOADING,
  SET_REDIRECT_URL,
} from './AppActions';

// Initial State
const initState = {
  dialogs: [],
  redirectUrl: '',
  isLoading: false,
};

const AppReducer = (state = initState, action) => {
  switch (action.type) {
    case DIALOG_OPEN:
      return {
        ...state,
        dialogs: [
          ...state.dialogs,
          { title: action.title, message: action.message, id: action.id },
        ],
      };
    case DIALOG_CLOSE:
      return {
        ...state,
        dialogs: state.dialogs.filter(d => d.id !== action.id),
      };
    case LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case SET_REDIRECT_URL:
      return {
        ...state,
        redirectUrl: action.url,
      };
  }
  return state;
};

/* Selectors */
export const getDialogs = state => state.app.dialogs;
export const isLoading = state => state.app.isLoading;
export const getRedirectUrl = state => state.app.redirectUrl;

// Export Reducer
export default AppReducer;

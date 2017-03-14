// Import Actions
import {
  LOADING,
  SET_REDIRECT_URL,
} from './AppActions';

// Initial State
const initState = {
  redirectUrl: '',
  isLoading: false,
};

const AppReducer = (state = initState, action) => {
  switch (action.type) {
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

export const isLoading = state => state.app.isLoading;
export const getRedirectUrl = state => state.app.redirectUrl;

// Export Reducer
export default AppReducer;

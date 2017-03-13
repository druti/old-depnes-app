// Import Actions
import {
  SET_REDIRECT_URL,
} from './AppActions';

// Initial State
const initState = {
  redirectUrl: '',
};

const AppReducer = (state = initState, action) => {
  switch (action.type) {
    case SET_REDIRECT_URL:
      return {
        ...state,
        redirectUrl: action.url,
      };
  }
  return state;
};

/* Selectors */

// Get letMakePath
export const getRedirectUrl = state => state.app.redirectUrl;

// Export Reducer
export default AppReducer;

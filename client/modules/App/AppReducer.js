// Import Actions
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  PROTECTED_TEST,
} from './AppActions';

// Initial State
const initState = {
  error: '',
  message: '',
  authenticated: false,
  user: null,
};

const AppReducer = (state = initState, action) => {
  switch (action.type) {
    case AUTH_USER:
      return {
        ...state,
        error: '',
        message: '',
        authenticated: true,
        user: action.user,
      };
    case UNAUTH_USER:
      return { ...state, authenticated: false, user: null };
    case AUTH_ERROR:
      return { ...state, error: action.payload };
    case PROTECTED_TEST:
      return { ...state, content: action.payload };
  }
  return state;
};

/* Selectors */

// Get letMakePath
export const getLetMakePath = state => state.app.letMakePath;

// Export Reducer
export default AppReducer;

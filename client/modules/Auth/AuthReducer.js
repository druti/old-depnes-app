// Import Actions
import {
  AUTH_USER,
  UNAUTH_USER,
  AUTH_ERROR,
  AUTH_ERROR_RESET,
  PROTECTED_TEST,
} from './AuthActions';

// Initial State
const initState = {
  error: '',
  user: null,
};

const AuthReducer = (state = initState, action) => {
  switch (action.type) {
    case AUTH_USER:
      return {
        ...state,
        error: '',
        user: action.user,
      };
    case UNAUTH_USER:
      return { ...state, user: null };
    case AUTH_ERROR:
      return { ...state, error: action.reason };
    case AUTH_ERROR_RESET:
      return { ...state, error: '' };
    case PROTECTED_TEST:
      return { ...state, content: action.payload };
  }
  return state;
};

/* Selectors */

// Get letMakePath
export const getCurrentUser = state => state.auth.user;

// Export Reducer
export default AuthReducer;

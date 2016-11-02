// Import Actions
import { TOGGLE_MAKE_PATH } from './AppActions';

// Initial State
const initialState = {
  letMakePath: false,
};

const AppReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_MAKE_PATH:
      return {
        letMakePath: !state.letMakePath,
      };

    default:
      return state;
  }
};

/* Selectors */

// Get letMakePath
export const getLetMakePath = state => state.app.letMakePath;

// Export Reducer
export default AppReducer;

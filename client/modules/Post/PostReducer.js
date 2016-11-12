import { UPDATE_SELECTION, UPDATE_EDITOR, TOGGLE_MAKE_MODE, ADD_POST, ADD_POSTS, DELETE_POST } from './PostActions';

const initState = {
  navigator: {
    selection: null,
    changes: [], // full of quill-deltas
    makeMode: false,
  },
  data: [],
};

const PostReducer = (state = initState, action) => {
  switch (action.type) {
    case TOGGLE_MAKE_MODE :
      return {
        navigator: Object.assign({}, state.navigator, { makeMode: !state.navigator.makeMode}),
        data: state.data,
      };

    case UPDATE_SELECTION :
      return updateSelection(state, action);

    case UPDATE_EDITOR :
      return updateEditor(state, action);

    case ADD_POST :
      if (!action.post) {
        return state;
      }
      return {
        navigator: Object.assign({}, state.navigator, {changes: []}),
        data: [action.post, ...state.data],
      };

    case ADD_POSTS :
      return {
        navigator: state.navigator,
        data: action.posts,
      };

    case DELETE_POST :
      return {
        navigator: state.navigator,
        data: state.data.filter(post => post.cuid !== action.cuid),
      };

    default:
      return state;
  }
};

function updateSelection(state, action) {
  state = JSON.parse(JSON.stringify(state));
  state.navigator.selection = action.range;
  return state;
}

function updateEditor(state, action) {
  state = JSON.parse(JSON.stringify(state));
  state.navigator.changes.push(action.change);
  return state;
}

/* Selectors */

export const getNavigator = state => state.posts.navigator;

// Get all posts
export const getPosts = state => state.posts.data;

// Get post by cuid
export const getPost = (state, cuid) => state.posts.data.filter(post => post.cuid === cuid)[0];

// Export Reducer
export default PostReducer;

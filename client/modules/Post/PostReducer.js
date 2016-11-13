import { UPDATE_EDITOR, TOGGLE_MAKE_MODE, ADD_POST, ADD_POSTS, DELETE_POST } from './PostActions';

const initState = {
  data: [],
  navigator: {
    changes: [], // full of quill-deltas
    makeMode: false,
  },
  blank: {
    content: {
      ops: [{insert: '\n'}],
      authors: [null],
    },
    cuid: 'blank',
  },
};

const PostReducer = (state = initState, action) => {
  switch (action.type) {
    case TOGGLE_MAKE_MODE :
      return {
        blank: state.blank,
        data: state.data,
        navigator: Object.assign({}, state.navigator, { makeMode: !state.navigator.makeMode}),
      };

    case UPDATE_EDITOR :
      return updateEditor(state, action);

    case ADD_POST :
      return addPost(state, action);

    case ADD_POSTS :
      return {
        blank: state.blank,
        data: action.posts,
        navigator: state.navigator,
      };

    case DELETE_POST :
      return {
        blank: state.blank,
        data: state.data.filter(post => post.cuid !== action.cuid),
        navigator: state.navigator,
      };

    default:
      return state;
  }
};

function updateEditor(state, action) {
  state = JSON.parse(JSON.stringify(state));
  state.navigator.changes.push(action.change);
  return state;
}

function addPost(state, action) {
  if (!action.post) {
    return state;
  }
  return {
    blank: state.blank,
    data: [action.post, ...state.data],
    navigator: Object.assign({}, state.navigator, {changes: []}),
  };
}

/* Selectors */

export const getNavigator = state => state.posts.navigator;

// Get all posts
export const getPosts = state => state.posts.data;

// Get post by cuid
export const getPost = (state, cuid, fallback = true) => {
  const p = state.posts.data.filter(post => post.cuid === cuid)[0];
  return p || (fallback && state.posts.blank);
};

// Export Reducer
export default PostReducer;

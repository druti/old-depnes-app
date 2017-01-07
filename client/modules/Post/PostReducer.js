import { TOGGLE_MAKE_MODE, ADD_POST, ADD_POSTS, DELETE_POST } from './PostActions';

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
    htmlContent: '',
    cuid: 'blank',
  },
};

const PostReducer = (state = initState, action) => {
  switch (action.type) {
    case TOGGLE_MAKE_MODE :
      return {
        data: state.data,
        navigator: Object.assign({}, state.navigator, { makeMode: !state.navigator.makeMode}),
        blank: state.blank,
      };

    case ADD_POST :
      return addPost(state, action);

    case ADD_POSTS :
      return {
        data: action.posts,
        navigator: state.navigator,
        blank: state.blank,
      };

    case DELETE_POST :
      return {
        data: state.data.filter(post => post.cuid !== action.cuid),
        navigator: state.navigator,
        blank: state.blank,
      };

    default:
      return state;
  }
};

function addPost(state, action) {
  if (!action.post) {
    return state;
  }
  return {
    data: [action.post, ...state.data],
    navigator: state.navigator,
    blank: state.blank,
  };
}

/* Selectors */

export const getNavigator = state => state.posts.navigator;

// Get all posts
export const getPosts = state => state.posts.data;

// Get post by cuid
export const getPost = (state, cuid) => {
  if (cuid === 'blank') {
    return state.posts.blank;
  }
  return state.posts.data.filter(post => post.cuid === cuid)[0];
};

// Export Reducer
export default PostReducer;

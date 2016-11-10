import { UPDATE_CLONE, UPDATE_EDITOR_PATH, TOGGLE_MAKE_MODE, ADD_POST, ADD_POSTS, DELETE_POST } from './PostActions';

const initState = {
  navigator: {
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

    case UPDATE_EDITOR_PATH :
      return {
        navigator: state.navigator,
        data: state.data.map(path => {
          if (path.cuid === action.path.cuid) path.content = action.path.content;
          return path;
        }),
      };

    case UPDATE_CLONE :
      return {
        navigator: state.navigator,
        data: state.data.map(path => {
          if (path.cuid === '_CLONE') path.cuid = action.cuid;
          return path;
        }),
      };

    case ADD_POST :
      if (!action.post) {
        return state;
      }
      return {
        navigator: state.navigator,
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

/* Selectors */

export const getNavigator = state => state.posts.navigator;

// Get all posts
export const getPosts = state => state.posts.data;

// Get post by cuid
export const getPost = (state, cuid) => state.posts.data.filter(post => post.cuid === cuid)[0];

// Export Reducer
export default PostReducer;

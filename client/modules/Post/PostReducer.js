import {
  TOGGLE_CUSTOM_SELECT,
  TOGGLE_MAKE_MODE,
  REQUEST_POST,
  RECEIVE_POST,
  REQUEST_POSTS,
  RECEIVE_POSTS,
  DELETE_POST,
} from './PostActions';

const initState = {
  data: [],
  isFetching: false,
  hasFetched: false,
  blank: {
    content: {
      ops: [{insert: '\n'}],
      authors: [null],
    },
    htmlContent: '',
    sid: 'blank',
  },
  navigator: {
    changes: [], // full of quill-deltas
    customSelect: false,
    makeMode: false,
  },
};

const PostReducer = (state = initState, action) => {
  switch (action.type) {
    case TOGGLE_CUSTOM_SELECT :
      return {
        ...state,
        navigator: {
          ...state.navigator,
          customSelect: !state.navigator.customSelect,
        },
      };

    case TOGGLE_MAKE_MODE :
      return {
        ...state,
        navigator: {
          ...state.navigator,
          makeMode: !state.navigator.makeMode,
        },
      };

    case REQUEST_POST :
    case REQUEST_POSTS :
      return {
        ...state,
        isFetching: true,
        hasFetched: false,
      };

    case RECEIVE_POST :
      return {
        ...state,
        hasFetched: true,
        isFetching: false,
        data: action.post ? [...state.data, action.post] : state.data,
      };

    case RECEIVE_POSTS :
      return {
        ...state,
        hasFetched: true,
        isFetching: false,
        data: action.posts,
      };

    case DELETE_POST :
      return {
        ...state,
        data: state.data.filter(post => post.sid !== action.sid),
      };

    default:
      return state;
  }
};


export const getNavigator = state => state.posts.navigator;

export const isFetching = state => state.posts.isFetching;
export const hasFetched = state => state.posts.hasFetched;

export const getPosts = state => state.posts.data;

export const getPost = (state, sid) => {
  if (sid === 'blank') {
    return state.posts.blank;
  }
  return state.posts.data.filter(post => post.sid === sid)[0];
};

// Export Reducer
export default PostReducer;

import {
  TOGGLE_CUSTOM_SELECT,
  TOGGLE_MAKE_MODE,
  POST_REQUEST,
  POST_RECEIVE,
  POST_FAILURE,
  POSTS_REQUEST,
  POSTS_RECEIVE,
  POSTS_FAILURE,
  DELETE_POST,
} from './PostActions';

const initState = {
  data: [],
  awaiting: {},
  failed: {},
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

    case POST_REQUEST :
    case POSTS_REQUEST :
      return {
        ...state,
        awaiting: updateAwaiting(state, action, true),
      };

    case POST_RECEIVE :
      return {
        ...state,
        awaiting: updateAwaiting(state, action, false),
        data: action.post ? [...state.data, action.post] : state.data,
      };

    case POSTS_RECEIVE :
      return {
        ...state,
        awaiting: updateAwaiting(state, action, false),
        data: action.posts,
      };

    case DELETE_POST :
      return {
        ...state,
        data: state.data.filter(post => post.sid !== action.sid),
      };

    case POST_FAILURE :
    case POSTS_FAILURE :
      return {
        ...state,
        failed: updateFailed(state, action),
      };

    default:
      return state;
  }
};

function updateAwaiting(state, action, awaiting) {
  return {
    ...state.awaiting,
    [action.requestName]: awaiting,
  };
}

function updateFailed(state, action) {
  return {
    ...state.failed,
    [action.requestName]: {
      reason: action.reason,
    },
  };
}

export const getNavigator = state => state.posts.navigator;

export const getAwaiting = state => state.posts.awaiting;

export const getFailed = state => state.posts.failed;

export const getPosts = state => state.posts.data;

export const getPost = (state, sid) => {
  if (sid === 'blank') {
    return state.posts.blank;
  }
  return state.posts.data.filter(post => post.sid === sid)[0];
};

export default PostReducer;

import {
  HIGHLIGHT_NAVIGATOR,
  UNHIGHLIGHT_NAVIGATOR,
  SELECTION_SAVE,
  SELECTION_DELETE,
  TOGGLE_MAKE_MODE,
  POST_CACHED,
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
  new: {
    content: { ops: [{insert: '\n'}] },
    htmlContent: '',
    sid: 'new',
  },
  navigator: {
    highlight: false,
    selection: false,
    makeMode: false,
  },
};

const PostReducer = (state = initState, action) => {
  switch (action.type) {
    case HIGHLIGHT_NAVIGATOR :
    case UNHIGHLIGHT_NAVIGATOR :
      return {
        ...state,
        navigator: {
          ...state.navigator,
          highlight: action.highlight,
        },
      };

    case SELECTION_SAVE :
      return {
        ...state,
        navigator: {
          ...state.navigator,
          selection: action.selection,
        },
      };

    case SELECTION_DELETE :
      return {
        ...state,
        navigator: {
          ...state.navigator,
          selection: false,
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

    case POST_CACHED :
      return {
        ...state,
        failed: updateFailed(state, action, false),
      };

    case POST_REQUEST :
    case POSTS_REQUEST :
      return {
        ...state,
        awaiting: updateAwaiting(state, action, true),
        failed: updateFailed(state, action, false),
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

    case POST_FAILURE :
    case POSTS_FAILURE :
      return {
        ...state,
        awaiting: updateAwaiting(state, action, false),
        failed: updateFailed(state, action, true),
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

function updateAwaiting(state, action, awaiting) {
  return {
    ...state.awaiting,
    [action.requestName]: awaiting,
  };
}

function updateFailed(state, action, failed) {
  return {
    ...state.failed,
    [action.requestName]: failed ? {
      reason: action.reason,
    } : false,
  };
}

export const getNavigator = state => state.posts.navigator;

export const getNavigatorHighlight = state => state.posts.navigator.highlight;

export const getAwaiting = state => state.posts.awaiting;

export const getFailed = state => state.posts.failed;

export const getPosts = state => state.posts.data;

export const getGroupPosts = (state, sid) => {
  const currentPost = getPost(state, sid);
  return state.posts.data.filter(p => p.groupId === currentPost.groupId);
};

export const getPostAuthors = (post) => {
  const authorIds = [];
  post.content.ops.forEach(op => {
    if (op.attributes && op.attributes.author) {
      if (authorIds.indexOf(op.attributes.author) === -1) {
        authorIds.push(op.attributes.author);
      }
    }
  });
  return authorIds;
}

export const getPostsByUser = (state, userId) => {
  return state.posts.data.filter(p => getPostAuthors(p).includes(userId));
};

export const getPost = (state, sid) => {
  if (sid === 'new') {
    return state.posts.new;
  }
  return state.posts.data.filter(post => post.sid === sid)[0];
};

export default PostReducer;

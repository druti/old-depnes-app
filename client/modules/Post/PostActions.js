import callApi from '../../util/apiCaller';
import { getPost } from './PostReducer';

export const SELECTION_SAVE = 'SELECTION_SAVE';
export const SELECTION_DELETE = 'SELECTION_DELETE';

export const TOGGLE_MAKE_MODE = 'TOGGLE_MAKE_MODE';

export const POST_CACHED = 'POST_CACHED';
export const POST_REQUEST = 'POST_REQUEST';
export const POST_RECEIVE = 'POST_RECEIVE';
export const POST_FAILURE = 'POST_FAILURE';

export const POSTS_REQUEST = 'POSTS_REQUEST';
export const POSTS_RECEIVE = 'POSTS_RECEIVE';
export const POSTS_FAILURE = 'POSTS_FAILURE';

export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const ADD_POST_FAILURE  = 'ADD_POST_FAILURE';

export const DELETE_POST_REQUEST = 'DELETE_POST_REQUEST';
export const DELETE_POST = 'DELETE_POST';
export const DELETE_POST_FAILURE  = 'DELETE_POST_FAILURE';


export function saveSelection(selection) {
  return {
    type: SELECTION_SAVE,
    selection,
  };
}

export function deleteSelection() {
  return {
    type: SELECTION_DELETE,
  };
}

export function toggleMakeMode() {
  return {
    type: TOGGLE_MAKE_MODE,
  };
}


/*
 * POST
 */
export function fetchPost(sid) {
  return (dispatch, getState) => {
    if (getPost(getState(), sid))  {
      return dispatch(cachedPost(fetchPost.name));
    } else {
      dispatch(requestPost(fetchPost.name));
    }
    return callApi(`posts/${sid}`)
      .then(
        res => {
          dispatch(receivePost(fetchPost.name, res.post));
        },
        err => {
          dispatch(failedRequestPost(fetchPost.name, err.reason));
        }
      );
  };
}

export function cachedPost(requestName) {
  return {
    type: POST_CACHED,
    requestName,
  };
}

export function requestPost(requestName) {
  return {
    type: POST_REQUEST,
    requestName,
  };
}

export function receivePost(requestName, post) {
  return {
    type: POST_RECEIVE,
    requestName,
    post,
  };
}

export function failedRequestPost(requestName, reason) {
  return {
    type: POST_FAILURE,
    requestName,
    reason,
  };
}


/*
 * POSTS
 */
export function fetchPosts() {
  return (dispatch) => {
    dispatch(requestPosts(fetchPosts.name));
    return callApi('posts')
      .then(
        res => {
          dispatch(receivePosts(fetchPosts.name, res.posts));
        },
        err => {
          dispatch(failedRequestPosts(fetchPosts.name, err.reason));
        }
      );
  };
}

export function requestPosts(requestName) {
  return {
    type: POSTS_REQUEST,
    requestName,
  };
}

export function receivePosts(requestName, posts) {
  return {
    type: POSTS_RECEIVE,
    requestName,
    posts,
  };
}

export function failedRequestPosts(requestName, reason) {
  return {
    type: POSTS_FAILURE,
    requestName,
    reason,
  };
}


export function addPost({ content, htmlContent }) {
  return (dispatch) => {
    dispatch(addPostRequest());
    return callApi('posts', 'post', {
      post: {
        content,
        htmlContent,
      },
    }).then(
      res => {
        return dispatch(receivePost(addPost.name, res.post));
      },
      err => {
        return dispatch(failedAddPost(addPost.name, err.reason));
      }
    );
  };
}

export function addPostRequest() {
  return {
    type: ADD_POST_REQUEST,
  };
}

export function failedAddPost(requestName, reason) {
  return {
    type: ADD_POST_FAILURE,
    requestName,
    reason,
  };
}


export function deletePost(sid) {
  return {
    type: DELETE_POST,
    sid,
  };
}

export function deletePostRequest(sid) {
  return (dispatch) => {
    return callApi(`posts/${sid}`, 'delete').then(() => dispatch(deletePost(sid)));
  };
}

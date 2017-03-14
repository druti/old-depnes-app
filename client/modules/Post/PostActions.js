import callApi from '../../util/apiCaller';
import { getPost } from './PostReducer';

export const TOGGLE_CUSTOM_SELECT = 'TOGGLE_CUSTOM_SELECT';
export const TOGGLE_MAKE_MODE = 'TOGGLE_MAKE_MODE';

export const REQUEST_POST = 'REQUEST_POST';
export const RECEIVE_POST = 'RECEIVE_POST';
export const REQUEST_POSTS = 'REQUEST_POSTS';
export const RECEIVE_POSTS = 'RECEIVE_POSTS';
export const ADD_POST_REQUEST = 'ADD_POST_REQUEST';
export const DELETE_POST = 'DELETE_POST';


export function toggleCustomSelect() {
  return {
    type: TOGGLE_CUSTOM_SELECT,
  };
}

export function toggleMakeMode() {
  return {
    type: TOGGLE_MAKE_MODE,
  };
}


export function fetchPost(sid) {
  return (dispatch, getState) => {
    const cachedPost = getPost(getState(), sid);
    if (cachedPost) return Promise.resolve();
    dispatch(requestPost());
    return callApi(`posts/${sid}`)
      .then(res => {
        dispatch(receivePost(res.post))
      });
  };
}

export function requestPost() {
  return {
    type: REQUEST_POST,
  };
}

export function receivePost(post) {
  return {
    type: RECEIVE_POST,
    post,
  };
}


export function fetchPosts() {
  return (dispatch) => {
    dispatch(requestPosts());
    return callApi('posts').then(res => {
      dispatch(receivePosts(res.posts));
    });
  };
}

export function requestPosts() {
  return {
    type: REQUEST_POSTS,
  };
}

export function receivePosts(posts) {
  return {
    type: RECEIVE_POSTS,
    posts,
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
    }).then(res => dispatch(receivePost(res.post)));
  };
}

export function addPostRequest() {
  return {
    type: ADD_POST_REQUEST,
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

import callApi from '../../util/apiCaller';

// Export Constants
export const TOGGLE_MAKE_MODE = 'TOGGLE_MAKE_MODE';
export const UPDATE_NAVIGATOR = 'UPDATE_NAVIGATOR';
export const ADD_POST = 'ADD_POST';
export const ADD_POSTS = 'ADD_POSTS';
export const DELETE_POST = 'DELETE_POST';

// Export Actions
export function toggleMakeMode() {
  return {
    type: TOGGLE_MAKE_MODE,
  };
}

export function updateNavigator(navigator) {
  return {
    type: UPDATE_NAVIGATOR,
    navigator,
  };
}

export function addPost(post) {
  return {
    type: ADD_POST,
    post,
  };
}

export function addPostRequest(post) {
  return (dispatch) => {
    return callApi('posts', 'post', {
      post: {
        content: post.content,
        htmlContent: post.htmlContent,
        textContent: post.textContent,
      },
    }).then(res => dispatch(addPost(res.post)));
  };
}

export function addPosts(posts) {
  return {
    type: ADD_POSTS,
    posts,
  };
}

export function fetchPosts() {
  return (dispatch) => {
    return callApi('posts').then(res => {
      dispatch(addPosts(res.posts));
    });
  };
}

export function fetchPost(cuid) {
  return (dispatch) => {
    return callApi(`posts/${cuid}`).then(res => dispatch(addPost(res.post)));
  };
}

export function deletePost(cuid) {
  return {
    type: DELETE_POST,
    cuid,
  };
}

export function deletePostRequest(cuid) {
  return (dispatch) => {
    return callApi(`posts/${cuid}`, 'delete').then(() => dispatch(deletePost(cuid)));
  };
}

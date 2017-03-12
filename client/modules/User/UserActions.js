import callApi from '../../util/apiCaller';

// Export Constants
export const ADD_USER = 'ADD_USER';
export const ADD_USERS = 'ADD_USERS';
export const DELETE_USER = 'DELETE_USER';

// Export Actions
export function addUser(user) {
  return {
    type: ADD_USER,
    user,
  };
}

export function fetchUser(sid) {
  return (dispatch) => {
    return callApi(`user/${sid}`).then(res => dispatch(addUser(res.user)));
  };
}

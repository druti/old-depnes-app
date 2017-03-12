import {
  ADD_USER,
} from './UserActions';

const initState = {
  data: [],
};

const UserReducer = (state = initState, action) => {
  switch (action.type) {
    case ADD_USER:
      return addUser(state, action);

    default:
      return state;
  }
};

function addUser(state, action) {
  if (!action.user) {
    return state;
  }
  return {
    data: [action.user, ...state.data],
    navigator: state.navigator,
    blank: state.blank,
  };
}

// Get post by sid
export const getUser = (state, sid) => {
  return state.users.data.filter(user => user.sid === sid)[0];
};

// Export Reducer
export default UserReducer;

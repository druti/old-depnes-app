import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../UserReducer';
import { fetchUser } from '../../UserActions';
import { getCurrentUser } from '../../../Auth/AuthReducer';
import MasterLayout from '../../../../layouts/MasterLayout';

class ProfilePage extends Component { // eslint-disable-line
  componentWillMount() {
    const { params, dispatch } = this.props;
    dispatch(fetchUser(params.sid));
  }

  render() {
    const { switchLanguage, intl, user, params } = this.props;
    return (
      <MasterLayout
        params={params}
        switchLanguage={switchLanguage}
        intl={intl}
      >
        User: {user && user.firstName}
      </MasterLayout>
    );
  }
}

ProfilePage.need = [params => {
  return fetchUser(params.sid);
}];

ProfilePage.propTypes = {
  params: T.object.isRequired,
  dispatch: T.func.isRequired,
  switchLanguage: T.func.isRequired,
  intl: T.object.isRequired,
  user: T.object,
};

function mapStateToProps(state, props) {
  let user = getUser(state, props.params.sid);
  const currentUser = getCurrentUser(state);
  if (currentUser && currentUser.sid === props.params.sid) {
    user = currentUser;
  }
  return { user };
}

export default connect(mapStateToProps, dispatch => ({dispatch}))(ProfilePage);

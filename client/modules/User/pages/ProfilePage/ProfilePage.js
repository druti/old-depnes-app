import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { getUser } from '../../UserReducer';
import { fetchUser } from '../../UserActions';
import MasterLayout from '../../../../layouts/MasterLayout';

class ProfilePage extends Component { // eslint-disable-line
  render() {
    const { switchLanguage, intl, user } = this.props;
    return (
      <MasterLayout
        switchLanguage={switchLanguage}
        intl={intl}
      >
        {user.firstName}
      </MasterLayout>
    );
  }
}

ProfilePage.need = [params => {
  return fetchUser(params.sid);
}];

ProfilePage.propTypes = {
  params: T.object.isRequired,
  switchLanguage: T.func.isRequired,
  intl: T.object.isRequired,
  user: T.object,
};

function mapStateToProps(state, props) {
  return { user: getUser(state, props.params.sid) };
}

export default connect(mapStateToProps)(ProfilePage);

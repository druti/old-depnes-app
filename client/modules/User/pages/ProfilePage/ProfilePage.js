import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { fetchUser } from '../../UserActions';
import { getAwaiting, getFailed, getUser } from '../../UserReducer';
import MasterLayout from '../../../../layouts/MasterLayout';
import Loader from '../../../App/components/Loader/Loader';

class ProfilePage extends Component { // eslint-disable-line
  static propTypes = {
    awaiting: T.object.isRequired,
    failed: T.object.isRequired,
    params: T.object.isRequired,
    dispatch: T.func.isRequired,
    switchLanguage: T.func.isRequired,
    intl: T.object.isRequired,
    user: T.object,
  }

  componentWillMount() {
    this.fetchUser(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.sid !== this.props.params.sid) {
      this.fetchUser(nextProps);
    }
  }

  fetchUser = ({ params, dispatch }) => {
    dispatch(fetchUser(params.sid));
  }

  render() {
    const {
      awaiting,
      failed,
      user,
      params,
      intl,
      switchLanguage,
    } = this.props;

    let child;

    if (failed.fetchUser) {
      child = <h1>{failed.fetchUser.reason || 'Something bad happend'}</h1>;
    } else if (awaiting.fetchUser || !user) {
      child = <Loader />;
    } else {
      child = <h1>{user.firstName} {user.lastName}</h1>;
    }

    return (
      <MasterLayout
        params={params}
        switchLanguage={switchLanguage}
        intl={intl}
      >{child}
      </MasterLayout>
    );
  }
}

ProfilePage.need = [
  params => { return fetchUser(params.sid) },
];

export default connect(
  (state, props) => ({
    awaiting: getAwaiting(state),
    failed: getFailed(state),
    user: getUser(state, props.params.sid),
  }),
  dispatch => ({dispatch})
)(ProfilePage);

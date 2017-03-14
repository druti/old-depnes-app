import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { fetchUser } from '../../UserActions';
import { isFetching, hasFetched, getUser } from '../../UserReducer';
import MasterLayout from '../../../../layouts/MasterLayout';

class ProfilePage extends Component { // eslint-disable-line
  componentWillMount() {
    this.props.dispatch(fetchUser(this.props.params.sid));
  }

  render() {
    const {
      intl,
      user,
      params,
      switchLanguage,
      loading,
      loaded,
    } = this.props;

    return (
      <MasterLayout
        params={params}
        switchLanguage={switchLanguage}
        intl={intl}
      >
        {loading || !loaded ?
          <h1>Loading...</h1> : <h1>{user.firstName} {user.lastName}</h1>}
      </MasterLayout>
    );
  }
}

ProfilePage.need = [params => {
  return fetchUser(params.sid);
}];

ProfilePage.propTypes = {
  loading: T.bool.isRequired,
  loaded: T.bool.isRequired,
  params: T.object.isRequired,
  dispatch: T.func.isRequired,
  switchLanguage: T.func.isRequired,
  intl: T.object.isRequired,
  user: T.object,
};

function mapStateToProps(state, props) {
  return {
    loading: isFetching(state),
    loaded: hasFetched(state),
    user: getUser(state, props.params.sid),
  };
}

export default connect(mapStateToProps, dispatch => ({dispatch}))(ProfilePage);

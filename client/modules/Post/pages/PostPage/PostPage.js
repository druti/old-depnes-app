import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import MasterLayout from '../../../../layouts/MasterLayout';
import AuthorList from '../../components/AuthorList/AuthorList';
import Navigator from '../../components/Navigator/Navigator';

import { isFetching, hasFetched, getNavigator, getPost } from '../../PostReducer';
import { toggleMakeMode, fetchPost } from '../../PostActions';
import { setRedirectUrl } from '../../../App/AppActions';
import { getCurrentUser } from '../../../Auth/AuthReducer';

class PostPage extends Component { // eslint-disable-line
  componentWillMount() {
    const { params, user, makeMode, dispatch } = this.props;

    dispatch(fetchPost(params.sid));

    const server = typeof window === 'undefined';

    if (!server) {
      if (params.sid === 'blank') {
        if (!user) {
          dispatch(setRedirectUrl(location.pathname))
          browserHistory.replace('/login');
        } else if (!makeMode) {
          dispatch(toggleMakeMode());
        }
      }
    }
  }

  componentWillUnmount() {
    const { makeMode, dispatch } = this.props;

    if (makeMode) {
      dispatch(toggleMakeMode());
    }
  }

  render() {
    const {
      loading,
      loaded,
      user,
      params,
      switchLanguage,
      intl,
      post,
    } = this.props;

    let child;
    if (loading || !loaded) {
      child = <h1>Loading...</h1>;
    } else if (!user && params.sid === 'blank') {
      child = null;
    } else if (post) {
      child = (
        <div>
          <AuthorList params={params} path={post} />
          <Navigator params={params} path={post} />
        </div>
      );
    } else {
      child = <h1>404 Not Found</h1>;
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

// Actions required to provide data for this component to render in sever side.
PostPage.need = [params => {
  return fetchPost(params.sid);
}];


PostPage.propTypes = {
  loading: T.bool.isRequired,
  loaded: T.bool.isRequired,
  user: T.object,
  dispatch: T.func.isRequired,
  params: T.object.isRequired,
  switchLanguage: T.func.isRequired,
  makeMode: T.bool.isRequired,
  intl: T.object.isRequired,
  post: T.object,
};

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    ...getNavigator(state),
    post: getPost(state, props.params.sid),
    user: getCurrentUser(state),
    loading: isFetching(state),
    loaded: hasFetched(state),
  };
}

export default connect(mapStateToProps, dispatch => ({dispatch}))(PostPage);

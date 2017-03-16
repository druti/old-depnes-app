import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import MasterLayout from '../../../../layouts/MasterLayout';
import AuthorList from '../../components/AuthorList/AuthorList';
import Navigator from '../../components/Navigator/Navigator';

import { getAwaiting, getFailed, getPost, getNavigator } from '../../PostReducer';
import { toggleMakeMode, fetchPost } from '../../PostActions';
import { setRedirectUrl } from '../../../App/AppActions';
import { getCurrentUser } from '../../../Auth/AuthReducer';

class PostPage extends Component { // eslint-disable-line
  static propTypes = {
    awaiting: T.object.isRequired,
    failed: T.object.isRequired,
    user: T.object,
    dispatch: T.func.isRequired,
    params: T.object.isRequired,
    switchLanguage: T.func.isRequired,
    makeMode: T.bool.isRequired,
    intl: T.object.isRequired,
    post: T.object,
  }

  static need = [
    params => fetchPost(params.sid),
  ]

  componentWillMount() {
    this.fetchPost(this.props);
    this.requireAuth(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.sid !== this.props.params.sid) {
      this.fetchPost(nextProps);
      this.requireAuth(nextProps);
    }
  }

  componentWillUnmount() {
    const { makeMode, dispatch } = this.props;

    if (makeMode) {
      dispatch(toggleMakeMode());
    }
  }

  fetchPost = ({ params, dispatch }) => {
    dispatch(fetchPost(params.sid));
  }

  requireAuth = ({ params, user, makeMode, dispatch }) => {
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

  render() {
    const {
      post,
      user,
      params,
      awaiting,
      failed,
      switchLanguage,
      intl,
    } = this.props;

    let child;
    let isLoading = awaiting.fetchPost || !post;

    if (failed.fetchPost) {
      child = <h1>{failed.fetchPost.reason || 'Something bad happend'}</h1>;
      isLoading = false;
    } else if (!user && params.sid === 'blank') {
      child = null;
    } else if (post) {
      child = (
        <div>
          <AuthorList params={params} path={post} />
          <Navigator params={params} path={post} />
        </div>
      );
    }

    return (
      <MasterLayout
        params={params}
        switchLanguage={switchLanguage}
        intl={intl}
      > {child}
        {isLoading && <h1>Loading...</h1>}
      </MasterLayout>
    );
  }
}

export default connect(
  (state, props) => ({
    awaiting: getAwaiting(state),
    failed: getFailed(state),
    post: getPost(state, props.params.sid),
    user: getCurrentUser(state),
    ...getNavigator(state),
  }),
  dispatch => ({dispatch})
)(PostPage);

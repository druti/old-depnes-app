import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import MasterLayout from '../../../../layouts/MasterLayout';
import AuthorList from '../../components/AuthorList/AuthorList';
import Navigator from '../../components/Navigator/Navigator';
import Loader from '../../../App/components/Loader/Loader';

import { getAwaiting, getFailed, getPost, getNavigator } from '../../PostReducer';
import { toggleMakeMode, fetchPosts } from '../../PostActions';
import { setRedirectUrl } from '../../../App/AppActions';
import { getCurrentUser } from '../../../Auth/AuthReducer';

import styles from './postPage.scss'; // eslint-disable-line

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

  componentWillMount() {
    this.fetchPosts(this.props);
    this.requireAuth(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.sid !== this.props.params.sid) {
      this.fetchPosts(nextProps);
      this.requireAuth(nextProps);
    }
  }

  componentWillUnmount() {
    const { makeMode, dispatch } = this.props;

    if (makeMode) {
      dispatch(toggleMakeMode());
    }
  }

  fetchPosts = ({ dispatch }) => {
    dispatch(fetchPosts());
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
    let isLoading = awaiting.fetchPosts || !post;

    if (failed.fetchPosts) {
      child = <h1>{failed.fetchPosts.reason || 'Something bad happend'}</h1>;
      isLoading = false;
    } else if (!user && params.sid === 'blank') {
      child = null;
    } else if (post) {
      child = (
        <div className={styles.container}>
          {params.sid !== 'blank' &&
            <AuthorList params={params} path={post} user={user} />}
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
        {isLoading && <Loader />}
      </MasterLayout>
    );
  }
}

PostPage.need = [
  () => { return fetchPosts(); },
];

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

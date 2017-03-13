import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import MasterLayout from '../../../../layouts/MasterLayout';
import AuthorList from '../../components/AuthorList/AuthorList';
import Navigator from '../../components/Navigator/Navigator';

import { getNavigator, getPost } from '../../PostReducer';
import { toggleMakeMode, fetchPosts } from '../../PostActions';
import { setRedirectUrl } from '../../../App/AppActions';
import { getCurrentUser } from '../../../Auth/AuthReducer';

class PostPage extends Component { // eslint-disable-line
  componentWillMount() {
    const { params, user, makeMode, dispatch } = this.props;

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
    const { user, params, switchLanguage, intl, post } = this.props;
    return (
      <MasterLayout
        params={params}
        switchLanguage={switchLanguage}
        intl={intl}
      >
        {!user && params.sid === 'blank' ?
          null :
          <div>
            <AuthorList params={params} path={post} />
            <Navigator params={params} path={post} />
          </div>}
        {!post &&
          <h1>404 Not Found</h1>}
      </MasterLayout>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
PostPage.need = [() => {
  return fetchPosts();
}];


PostPage.propTypes = {
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
  };
}

export default connect(mapStateToProps, dispatch => ({dispatch}))(PostPage);

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import MasterLayout from '../../../../layouts/MasterLayout';
import AuthorList from '../../components/AuthorList/AuthorList';
import Navigator from '../../components/Navigator/Navigator';

import { getPost } from '../../PostReducer';

// Import Actions
import { fetchPosts } from '../../PostActions';

class PathPage extends Component { // eslint-disable-line
  render() {
    const { params, auth, switchLanguage, intl, path } = this.props;
    return (
      <MasterLayout
        params={params}
        auth={auth}
        switchLanguage={switchLanguage}
        intl={intl}
      >
      {path ?
        <div>
          <AuthorList auth={auth} path={path} />
          <Navigator auth={auth} path={path} />
        </div> :
        <h1>404 Not Found</h1>}
      </MasterLayout>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
PathPage.need = [() => {
  return fetchPosts();
}];


PathPage.propTypes = {
  auth: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  switchLanguage: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  path: PropTypes.object,
};

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    path: getPost(state, props.params.cuid) || state.posts.blank,
  };
}

export default connect(mapStateToProps, dispatch => ({dispatch}))(PathPage);

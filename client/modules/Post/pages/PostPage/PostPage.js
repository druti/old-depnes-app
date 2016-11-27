import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Scrollbars } from 'react-custom-scrollbars';

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
        auth={auth}
        switchLanguage={switchLanguage}
        intl={intl}
      >
        {path &&
          <div>
            <AuthorList auth={auth} path={path} />
            <Navigator auth={auth} params={params} path={path} />
          </div>}
        {!path &&
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
    path: getPost(state, props.params.cuid),
  };
}

export default connect(mapStateToProps, dispatch => ({dispatch}))(PathPage);

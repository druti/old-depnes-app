import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import MasterLayout from '../../../../layouts/MasterLayout';
import Navigator from '../../components/Navigator/Navigator';

import { getPost, getPosts } from '../../PostReducer';

// Import Actions
import { fetchPosts } from '../../PostActions';

const PostPage = props => {
  return (
    <MasterLayout
      params={props.params}
      auth={props.auth}
      switchLanguage={props.switchLanguage}
      intl={props.intl}
    >
      <Navigator path={props.path} paths={props.paths} />
    </MasterLayout>
  );
};

// Actions required to provide data for this component to render in sever side.
PostPage.need = [() => {
  return fetchPosts();
}];


PostPage.propTypes = {
  path: PropTypes.object,
  paths: PropTypes.array,
};

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    paths: getPosts(state),
    path: getPost(state, props.params.cuid),
  };
}

export default connect(mapStateToProps)(PostPage);
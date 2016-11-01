import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import Navigator from '../../components/Navigator/Navigator';

// Import Actions
import { fetchPost } from '../../PostActions';

// Import Selectors
import { getPost, getPosts } from '../../PostReducer';

export function PostPage(props) {
  return (
    <div>
      <Helmet title={props.post.textContent.substring(0, 25)} />
      <Navigator
        paths={props.posts}
        path={props.post}
      />
    </div>
  );
}

// Actions required to provide data for this component to render in sever side.
PostPage.need = [params => {
  return fetchPost(params.cuid);
}];

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    posts: getPosts(state),
    post: getPost(state, props.params.cuid),
  };
}


const PostType = {
  textContent: PropTypes.string.isRequired,
  content: PropTypes.object.isRequired,
  cuid: PropTypes.string.isRequired,
};

PostPage.propTypes = {
  post: PropTypes.shape(PostType).isRequired,
  posts: PropTypes.arrayOf(PropTypes.shape(PostType)).isRequired,
};

export default connect(mapStateToProps)(PostPage);

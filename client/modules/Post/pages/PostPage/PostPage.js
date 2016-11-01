import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import Navigator from '../../components/Navigator/Navigator';

// Import Actions
import { fetchPost } from '../../PostActions';

// Import Selectors
import { getPost } from '../../PostReducer';

const PostPage = props => {
  if (!props.path) {
    return <h1>404 Not Found</h1>;
  }

  return (
    <div>
      <Helmet title={props.path.textContent.substring(0, 25)} />
      <Navigator
        path={props.path}
      />
    </div>
  );
};

// Actions required to provide data for this component to render in sever side.
PostPage.need = [params => {
  return fetchPost(params.cuid);
}];

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    path: getPost(state, props.params.cuid),
  };
}


const PostType = {
  textContent: PropTypes.string.isRequired,
  content: PropTypes.object.isRequired,
  cuid: PropTypes.string.isRequired,
};

PostPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  path: PropTypes.shape(PostType),
};

export default connect(mapStateToProps, dispatch => ({ dispatch }))(PostPage);

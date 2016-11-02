import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

// Import Components
import PostList from '../../components/PostList';

// Import Actions
import { addPostRequest, fetchPosts, deletePostRequest } from '../../PostActions';
import { toggleMakePath } from '../../../App/AppActions';

// Import Selectors
import { getLetMakePath } from '../../../App/AppReducer';

class PostListPage extends Component {
  componentWillMount() {
    this.props.dispatch(fetchPosts());
  }

  handleDeletePost = post => {
    if (confirm('Do you want to delete this post')) { // eslint-disable-line
      this.props.dispatch(deletePostRequest(post));
    }
  };

  handleAddPost = (content, htmlContent, textContent) => {
    this.props.dispatch(toggleMakePath());
    this.props.dispatch(addPostRequest({ content, htmlContent, textContent }));
  };

  render() {
    return (
      <div>
        <PostList handleDeletePost={this.handleDeletePost} />
      </div>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
PostListPage.need = [() => { return fetchPosts(); }];

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    letMakePath: getLetMakePath(state),
  };
}

PostListPage.propTypes = {
  letMakePath: PropTypes.bool.isRequired,
  dispatch: PropTypes.func.isRequired,
};

PostListPage.contextTypes = {
  router: React.PropTypes.object,
};

export default connect(mapStateToProps)(PostListPage);

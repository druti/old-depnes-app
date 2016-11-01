import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

// Import Selectors
import { getPosts } from '../PostReducer';

// Import Components
import PostListItem from './PostListItem/PostListItem';

function PostList(props) {
  return (
    <div className='listView'>
      {
        props.posts.map(post => (
          <PostListItem
            post={post}
            key={post.cuid}
            onDelete={() => props.handleDeletePost(post.cuid)}
          />
        ))
      }
    </div>
  );
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    content: PropTypes.object.isRequired,
    htmlContent: PropTypes.string.isRequired,
    textContent: PropTypes.string.isRequired,
    cuid: PropTypes.string.isRequired,
  })).isRequired,
  handleDeletePost: PropTypes.func.isRequired,
};

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    posts: getPosts(state),
  };
}

export default connect(mapStateToProps)(PostList);

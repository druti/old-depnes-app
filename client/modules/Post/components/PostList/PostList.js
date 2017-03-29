import React, { PropTypes } from 'react';

import styles from './postList.scss'; // eslint-disable-line

import Card from '../PostListItem/PostCard';

const PostList = ({ posts }) => {
  const groupIds = [];
  const filteredPosts = posts.filter(p => {
    if (!groupIds.includes(p.groupId)) {
      groupIds.push(p.groupId);
      return true;
    }
  });
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {filteredPosts.map((post, i) => (
          <Card post={post} key={i} />
        ))}
      </div>
    </div>
  );
};

PostList.propTypes = {
  posts: PropTypes.arrayOf(PropTypes.shape({
    content: PropTypes.object.isRequired,
    sid: PropTypes.string.isRequired,
  })).isRequired,
};

export default PostList;

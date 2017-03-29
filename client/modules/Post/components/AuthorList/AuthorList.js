import React, { PropTypes as T } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import AuthorChip from './AuthorChip';

import styles from './styles.scss'; // eslint-disable-line

const PostAuthors = ({ post }) => {
  const authorIds = [];
  post.content.ops.forEach(op => {
    if (op.attributes && op.attributes.author) {
      if (authorIds.indexOf(op.attributes.author) === -1) {
        authorIds.push(op.attributes.author);
      }
    }
  });

  const authors = authorIds.map(id => <AuthorChip id={id} key={id} />);

  return (
    <div className={styles.container}>
      <Scrollbars
        autoHeight
        className={styles.scrollBars}
      >
        <div className={styles.inner}>
          {authors}
        </div>
      </Scrollbars>
    </div>
  );
};

PostAuthors.propTypes = {
  post: T.object.isRequired,
};

export default PostAuthors;

import React, { PropTypes as T } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import AuthorChip from './AuthorChip';

import styles from './styles.scss'; // eslint-disable-line

const PathAuthors = ({ path }) => {
  const authorIds = [];
  path.content.ops.forEach(op => {
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

PathAuthors.propTypes = {
  user: T.object,
  params: T.object.isRequired,
  path: T.object.isRequired,
};

export default PathAuthors;

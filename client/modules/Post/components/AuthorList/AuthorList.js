import React, { PropTypes } from 'react';
import Avatar from 'react-toolbox/lib/avatar';
import Chip from 'react-toolbox/lib/chip';
import { Scrollbars } from 'react-custom-scrollbars';

import styles from './styles.scss';

const PathAuthors = ({ path }) => {
  const ops = path.content.ops || [];
  const contentAuthorIds = [];
  const formatAuthorIds = [];
  ops.forEach(op => {
    if (op.attributes) {
      if (op.attributes.contentAuthorId) {
        contentAuthorIds.push(op.attributes.contentAuthorId);
      }
      if (op.attributes.formatAuthorId) {
        formatAuthorIds.push(op.attributes.formatAuthorId);
      }
    }
  });
  /* TODO merge contentAuthorIds and formatAuthorIds, scrapping duplicates
   * fetch username/nickname for each user through auth0
   * repalce authors below
   */

  const authors = [];
  for (let i = 0; i < 50; i++) {
    authors.push(
      <Chip key={i}>
        <Avatar title='A' /><span>Author Name</span>
      </Chip>
    );
  }

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
  path: PropTypes.object,
};

export default PathAuthors;

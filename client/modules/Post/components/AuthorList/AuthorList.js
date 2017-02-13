import React, { PropTypes } from 'react';
import Avatar from 'react-toolbox/lib/avatar';
import Chip from 'react-toolbox/lib/chip';
import { Scrollbars } from 'react-custom-scrollbars';

import styles from './styles.scss'; // eslint-disable-line

const PathAuthors = ({ user, path }) => {
  const currentAuthor = { contentAuthorId: user.user_id };
  const authorMap = path.content.authors || [currentAuthor];
  const contentAuthorIds = [];
  const formatAuthorIds = [];
  authorMap.forEach(authors => {
    if (authors) {
      if (authors.contentAuthorId) {
        contentAuthorIds.push(authors.contentAuthorId);
      }
      if (authors.formatAuthorId) {
        formatAuthorIds.push(authors.formatAuthorId);
      }
    }
  });
  /* TODO merge contentAuthorIds and formatAuthorIds, scrapping duplicates
   * fetch username/nickname for each user through auth0
   * replace authors below
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
  user: PropTypes.object.isRequired,
  path: PropTypes.object.isRequired,
};

export default PathAuthors;

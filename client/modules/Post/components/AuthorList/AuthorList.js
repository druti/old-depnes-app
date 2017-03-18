import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import Avatar from 'react-toolbox/lib/avatar';
import Chip from 'react-toolbox/lib/chip';
import { Scrollbars } from 'react-custom-scrollbars';
import { getNavigator } from '../../PostReducer';
import { getCurrentUser } from '../../../Auth/AuthReducer';

import styles from './styles.scss'; // eslint-disable-line

const PathAuthors = () => {
  /*
  const currentAuthor = user && { contentAuthorId: user.sid };
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
  user: T.object,
  params: T.object.isRequired,
  path: T.object.isRequired,
  selection: T.oneOfType([T.bool, T.object]),
  makeMode: T.bool.isRequired,
  dispatch: T.func.isRequired,
};

function mapStateToProps(state) {
  return {
    ...getNavigator(state),
    user: getCurrentUser(state),
  };
}

export default connect(mapStateToProps, dispatch => ({ dispatch }))(PathAuthors);

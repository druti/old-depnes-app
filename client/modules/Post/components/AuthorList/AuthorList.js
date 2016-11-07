import React, { PropTypes } from 'react';
import Avatar from 'react-toolbox/lib/avatar';
import Chip from 'react-toolbox/lib/chip';
import { Scrollbars } from 'react-custom-scrollbars';

const PathAuthors = ({ path }) => {
  const ops = path.content.ops;
  const contentAuthorIds = [];
  const formatAuthorIds = [];
  ops.forEach(op => {
    if (op.attributes) {
      if (op.attributes.authors) {
        if (op.attributes.authors.contentAuthorId) {
          contentAuthorIds.push(op.attributes.authors.contentAuthorId);
        }
        if (op.attributes.authors.formatAuthorId) {
          formatAuthorIds.push(op.attributes.authors.formatAuthorId);
        }
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
    <div
      style={{
        margin: '1rem 0',
        whiteSpace: 'nowrap',
      }}
    >
      <Scrollbars autoHeight style={{width: '100%'}}>
        <div style={{marginBottom: '1rem'}}>
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

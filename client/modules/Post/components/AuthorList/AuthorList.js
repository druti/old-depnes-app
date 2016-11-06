import React from 'react';
import Avatar from 'react-toolbox/lib/avatar';
import Chip from 'react-toolbox/lib/chip';
import { Scrollbars } from 'react-custom-scrollbars';

const PathAuthors = () => {
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
};

export default PathAuthors;

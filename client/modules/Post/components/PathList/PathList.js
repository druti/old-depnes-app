import React, { PropTypes } from 'react';

import styles from './pathList.scss'; // eslint-disable-line

import Card from '../PathListItem/PathCard';

const PathList = ({ paths }) => {
  const groupIds = [];
  const filteredPaths = paths.filter(p => {
    if (!groupIds.includes(p.groupId)) {
      groupIds.push(p.groupId);
      return true;
    }
  });
  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {filteredPaths.map((path, i) => (
          <Card path={path} key={i} />
        ))}
      </div>
    </div>
  );
};

PathList.propTypes = {
  paths: PropTypes.arrayOf(PropTypes.shape({
    content: PropTypes.object.isRequired,
    sid: PropTypes.string.isRequired,
  })).isRequired,
};

export default PathList;

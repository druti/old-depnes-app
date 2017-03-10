import React, { PropTypes } from 'react';

import { deltaToString } from '../../../util/delta';

import styles from './pathList.scss'; // eslint-disable-line

import Card from './PathListItem/PathCard';

const PathList = (props) => {
  let Cards = [];
  const paths = props.paths;

  for (let i = 0; i < paths.length; i++) {
    let path = paths[i];
    const href = '/paths/' + path.sid;
    Cards.push(
      <Card href={href} key={i}>
        {deltaToString(path.content, 200)}
      </Card>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        {Cards.length ? Cards : <div className={styles['no-paths']}><h4>Be the first to write something!</h4></div>}
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

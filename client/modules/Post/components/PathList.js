import React, { PropTypes } from 'react';
import Delta from 'quill-delta';

import { deltaToString } from '../../../util/delta';

import Card from './PathListItem/PathCard';

const PathList = (props) => {
  let Cards = [];
  const paths = props.paths;

  for (let i = 0; i < paths.length; i++) {
    let path = paths[i];
    const href = '/paths/' + path.cuid;
    Cards.push(
      <Card href={href} key={i}>
        {deltaToString(path.content, 200)}
      </Card>
    );
  }

  return (
    <div style={{display: 'flex', flexWrap: 'wrap', background: '#fafafa'}}>
      {Cards}
    </div>
  );
};

PathList.propTypes = {
  paths: PropTypes.arrayOf(PropTypes.shape({
    content: PropTypes.object.isRequired,
    cuid: PropTypes.string.isRequired,
  })).isRequired,
};

export default PathList;

import React, { PropTypes } from 'react';
import Delta from 'quill-delta';

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
    htmlContent: PropTypes.string.isRequired,
    textContent: PropTypes.string.isRequired,
    cuid: PropTypes.string.isRequired,
  })).isRequired,
};

function deltaToString(delta, strLength) {
  let str = '';
  delta = new Delta(delta);
  for (let i = 0; i < delta.ops.length; i++) {
    const text = delta.ops[i].insert;
    if (text) {
      str += text;
      if (str.length >= strLength) {
        break;
      }
    }
  }
  return str.slice(0, strLength);
}

export default PathList;

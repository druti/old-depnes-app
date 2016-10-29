import React, { PropTypes } from 'react';

import { browserHistory } from 'react-router';
import { Button } from 'react-toolbox/lib/button';

const MdlButton = props => {
  return (
    <Button
      {...props}
      onClick={(e) => {
        e.preventDefault();
        browserHistory.push(props.href)
      }}
    >
      {props.children}
    </Button>
  );
};

MdlButton.propTypes = {
  href: PropTypes.string,
  children: PropTypes.element,
};

export default MdlButton;

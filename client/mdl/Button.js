import React, { PropTypes } from 'react';

import { browserHistory } from 'react-router';
import Button from 'react-toolbox/lib/button/Button';
import IconButton from 'react-toolbox/lib/button/IconButton';

export const LinkButton = props => {
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

LinkButton.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.element,
};

export const LinkIconButton = props => {
  return (
    <IconButton
      {...props}
      onClick={(e) => {
        e.preventDefault();
        browserHistory.push(props.href)
      }}
    >
      {props.children}
    </IconButton>
  );
};

LinkIconButton.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.element,
};

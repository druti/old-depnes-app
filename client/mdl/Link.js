import React, { PropTypes } from 'react';

import { browserHistory } from 'react-router';
import { Link } from 'react-toolbox/lib/link';

const MdlLink = props => {
  return (
    <Link
      {...props}
      onClick={(e) => {
        e.preventDefault();
        browserHistory.push(props.href)
      }}
    >
      {props.children}
    </Link>
  );
};

MdlLink.propTypes = {
  href: PropTypes.string,
  children: PropTypes.element,
};

export default MdlLink;

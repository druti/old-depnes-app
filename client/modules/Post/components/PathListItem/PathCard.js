import React, { PropTypes } from 'react';

import { Card, CardTitle, CardText, CardActions } from 'react-toolbox/lib/card';
import { LinkButton } from '../../../../mdl/Button';

import cardTheme from './cardTheme.scss';

const PathCard = (props) => {
  return (
    <Card theme={cardTheme}>
      <CardTitle
        title='Title goes here'
        subtitle='Subtitle here'
      />
      <CardText>{props.children}</CardText>
      <CardActions>
        <LinkButton label='Read' href={props.href} />
      </CardActions>
    </Card>
  );
};

PathCard.propTypes = {
  children: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
};

export default PathCard;

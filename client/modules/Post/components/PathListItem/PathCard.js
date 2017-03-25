import React, { PropTypes } from 'react';

import Card from 'react-toolbox/lib/card/Card';
import CardTitle from 'react-toolbox/lib/card/CardTitle';
import CardText from 'react-toolbox/lib/card/CardText';
import CardActions from 'react-toolbox/lib/card/CardActions';
import { LinkButton } from '../../../../mdl/Button';

// eslint-disable-next-line
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

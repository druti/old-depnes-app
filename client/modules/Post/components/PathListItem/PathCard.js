import React, { Component, PropTypes as T } from 'react';
import { browserHistory } from 'react-router';

import { deltaToString } from '../../../../util/delta';

import AuthorList from '../AuthorList/AuthorList';
import Card from 'react-toolbox/lib/card/Card';
import CardText from 'react-toolbox/lib/card/CardText';
import CardActions from 'react-toolbox/lib/card/CardActions';
import { LinkButton } from '../../../../mdl/Button';

// eslint-disable-next-line
import cardTheme from './cardTheme.scss';

class PathCard extends Component {
  goToPath = () => {
    browserHistory.push(`/paths/${this.props.path.sid}`);
  }

  render() {
    const { path } = this.props;
    return (
      <Card theme={cardTheme}>
        <AuthorList path={path} />
        <CardText theme={cardTheme} onClick={this.goToPath}>
          {deltaToString(path.content, 200)}
        </CardText>
        <CardActions>
          <LinkButton primary label='Read' href={`/paths/${path.sid}`} />
        </CardActions>
      </Card>
    );
  }
}

PathCard.propTypes = {
  path: T.object.isRequired,
};

export default PathCard;

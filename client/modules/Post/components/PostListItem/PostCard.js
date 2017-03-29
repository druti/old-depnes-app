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

class PostCard extends Component {
  goToPost = () => {
    browserHistory.push(`/posts/${this.props.post.sid}`);
  }

  render() {
    const { post } = this.props;
    return (
      <Card theme={cardTheme}>
        <AuthorList post={post} />
        <CardText theme={cardTheme} onClick={this.goToPost}>
          {deltaToString(post.content, 200)}
        </CardText>
        <CardActions>
          <LinkButton primary label='Read' href={`/posts/${post.sid}`} />
        </CardActions>
      </Card>
    );
  }
}

PostCard.propTypes = {
  post: T.object.isRequired,
};

export default PostCard;

import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
//import { browserHistory } from 'react-router';

import Avatar from 'react-toolbox/lib/avatar/Avatar';
import Chip from 'react-toolbox/lib/chip/Chip';
import Link from '../../../../mdl/Link';

import { highlightAuthor, unhighlightAuthor } from '../Navigator/authorship';

import { getNavigatorHighlight } from '../../PostReducer';
import { getUser } from '../../../User/UserReducer';
import { highlightNavigator, unhighlightNavigator } from '../../PostActions';
import { fetchUser } from '../../../User/UserActions';

// eslint-disable-next-line
import theme from './chipTheme.scss';

class AuthorChip extends Component { // eslint-disable-line
  static propTypes = {
    user: T.object,
    id: T.string.isRequired,
    fetchUser: T.func.isRequired,
    highlight: T.oneOfType([T.bool, T.object]),
    highlightNavigator: T.func.isRequired,
    unhighlightNavigator: T.func.isRequired,
  }

  constructor() {
    super();
    this.state = {
      expanded: false,
      loading: true,
      failed: false,
    };
  }

  componentWillMount() {
    this.props.fetchUser(this.props.id).then(
      () => {
        this.setState({ loading: false });
      },
      err => {
        this.setState({ failed: err, loading: false });
      }
    );
  }

  toggleHighlight = () => {
    const {
      user,
      highlight,
    } = this.props;

    if (highlight) {
      unhighlightAuthor(highlight.authorId);
      if (highlight.authorId === user.sid) {
        this.props.unhighlightNavigator();
        this.setState({ expanded: false });
      } else {
        this.highlightAuthor(user.sid);
      }
    } else {
      this.highlightAuthor(user.sid);
    }
  }

  highlightAuthor = (id) => {
    this.props.highlightNavigator({ authorId: id });
    highlightAuthor(id, '#ff4081');
    this.setState({ expanded: true });
  }

  render() {
    const { expanded, loading, failed } = this.state;
    const { user, highlight } = this.props;

    let child;
    if (user) {
      child = (
        <Chip onClick={this.toggleHighlight} theme={theme}>
          <Avatar title='A' />
          <span>{`${user.firstName} ${user.lastName}`}</span>
          {expanded && highlight && highlight.authorId === user.sid &&
            <Link
              theme={theme}
              href={`/user/${user.sid}`}
              label='View Profile'
            />}
        </Chip>
      );
    } else if (loading) {
      child = <Chip>Loading...</Chip>;
    } else {
      child = <Chip>{failed.reason || 'Something bad happend'}</Chip>;
    }

    return child;
  }
}

export default connect(
  (state, props) => ({
    user: getUser(state, props.id),
    highlight: getNavigatorHighlight(state),
  }),
  { fetchUser, highlightNavigator, unhighlightNavigator },
)(AuthorChip);

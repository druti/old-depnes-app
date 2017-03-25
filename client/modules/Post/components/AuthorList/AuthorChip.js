import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
//import { browserHistory } from 'react-router';

import Avatar from 'react-toolbox/lib/avatar/Avatar';
import Chip from 'react-toolbox/lib/chip/Chip';

import { getUser } from '../../../User/UserReducer';
import { fetchUser } from '../../../User/UserActions';

class AuthorChip extends Component { // eslint-disable-line
  static propTypes = {
    user: T.object,
    id: T.string.isRequired,
    dispatch: T.func.isRequired,
  }

  constructor() {
    super();
    this.state = {
      loading: true,
      failed: false,
    };
  }

  componentWillMount() {
    this.props.dispatch(fetchUser(this.props.id))
      .then(
        () => {
          this.setState({ loading: false });
        },
        err => {
          this.setState({ failed: err, loading: false });
        }
      );
  }

  render() {
    const { loading, failed } = this.state;
    const { user } = this.props;

    let child;
    if (user) {
      child = (
        <Chip>
          <Avatar title='A' />
          <span>{`${user.firstName} ${user.lastName}`}</span>
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
  }),
  dispatch => ({dispatch})
)(AuthorChip);

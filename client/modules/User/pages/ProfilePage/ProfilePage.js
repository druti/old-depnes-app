import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { fetchUser } from '../../UserActions';
import { getAwaiting, getFailed, getUser } from '../../UserReducer';
import { fetchPosts } from '../../../Post/PostActions';
import { getPostsByUser } from '../../../Post/PostReducer';
import Avatar from 'react-toolbox/lib/avatar/Avatar';
import MasterLayout from '../../../../layouts/MasterLayout';
import PathList from '../../../Post/components/PathList/PathList';
import Loader from '../../../App/components/Loader/Loader';

// eslint-disable-next-line
import styles from './profilePage.scss';

class ProfilePage extends Component { // eslint-disable-line
  static propTypes = {
    awaiting: T.object.isRequired,
    failed: T.object.isRequired,
    params: T.object.isRequired,
    fetchUser: T.func.isRequired,
    fetchPosts: T.func.isRequired,
    switchLanguage: T.func.isRequired,
    intl: T.object.isRequired,
    user: T.object,
    paths: T.array,
  }

  componentWillMount() {
    this.props.fetchUser(this.props.params.sid);
    this.props.fetchPosts();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.sid !== this.props.params.sid) {
      this.props.fetchUser(this.props.params.sid);
      this.props.fetchPosts();
    }
  }

  render() {
    const {
      awaiting,
      failed,
      user,
      paths,
      params,
      intl,
      switchLanguage,
    } = this.props;

    let child;

    if (failed.fetchUser) {
      child = <h1>{failed.fetchUser.reason || 'Something bad happend'}</h1>;
    } else if (awaiting.fetchUser || !user) {
      child = <Loader />;
    } else {
      child = (
        <div className={styles.container}>
          <div className={styles.authorContainer}>
            <Avatar theme={styles} title={`${user.firstName.slice(0, 1)}`} />
            <h3 className={styles.name}>{user.firstName} {user.lastName}</h3>
          </div>
          {paths.length > 0 &&
            <PathList paths={paths} />}
          {!paths.length &&
            <h4 className={styles.noContent}>{user.firstName} {user.lastName} hasn’t been active on Depnes yet. Check back later to see their posts.</h4>}
        </div>
      );
    }

    return (
      <MasterLayout
        params={params}
        switchLanguage={switchLanguage}
        intl={intl}
      >{child}
      </MasterLayout>
    );
  }
}

ProfilePage.need = [
  params => { return fetchUser(params.sid) },
  () => { return fetchPosts() },
];

export default connect(
  (state, props) => ({
    awaiting: getAwaiting(state),
    failed: getFailed(state),
    user: getUser(state, props.params.sid),
    paths: getPostsByUser(state, props.params.sid),
  }),
  { fetchUser, fetchPosts },
)(ProfilePage);

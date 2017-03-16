import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { getAwaiting, getFailed, getPosts } from '../../PostReducer';
import { fetchPosts } from '../../PostActions';
import MasterLayout from '../../../../layouts/MasterLayout';
import PathList from '../../components/PathList/PathList';
import { LinkButton } from '../../../../mdl/Button';
import styles from './postListPage.scss'; // eslint-disable-line

class PathListPage extends Component { // eslint-disable-line
  static propTypes = {
    awaiting: T.object.isRequired,
    failed: T.object.isRequired,
    paths: T.array.isRequired,
    dispatch: T.func.isRequired,
    params: T.object.isRequired,
    switchLanguage: T.func.isRequired,
    intl: T.object.isRequired,
  }

  static need = [
    () => { return fetchPosts() },
  ]

  componentWillMount() {
    this.props.dispatch(fetchPosts());
  }

  render() {
    const {
      paths,
      awaiting,
      failed,
      params,
      switchLanguage,
      intl,
    } = this.props;

    let child;
    let isLoading = awaiting.fetchPosts || !paths.length;

    if (failed.fetchPosts) {
      child = <h1>{failed.fetchPosts.reason || 'Something bad happend'}</h1>;
      isLoading = false;
    } else {
      child = <PathList paths={paths} />;
    }

    return (
      <MasterLayout
        params={params}
        switchLanguage={switchLanguage}
        intl={intl}
      >
        <div className={styles['cta-container']}>
          <LinkButton
            className={styles.cta}
            primary
            raised
            label='Write'
            href='/paths/blank'
          />
        </div>
        {child}
        {isLoading && <h1>Loading...</h1>}
      </MasterLayout>
    );
  }
}

export default connect(
  state => ({
    awaiting: getAwaiting(state),
    failed: getFailed(state),
    paths: getPosts(state),
  }),
  dispatch => ({dispatch})
)(PathListPage);

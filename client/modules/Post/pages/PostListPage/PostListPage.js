import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import MasterLayout from '../../../../layouts/MasterLayout';
import PathList from '../../components/PathList';

import { getPosts } from '../../PostReducer';
import { fetchPosts } from '../../PostActions';

import { LinkButton } from '../../../../mdl/Button';

import styles from './postListPage.scss'; // eslint-disable-line

class PathListPage extends Component { // eslint-disable-line
  render() {
    const { params, switchLanguage, intl, paths } = this.props;
    return (
      <MasterLayout
        params={params}
        user={{}}
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
        <PathList paths={paths} />
      </MasterLayout>
    );
  }
}

PathListPage.need = [() => { return fetchPosts(); }];

PathListPage.propTypes = {
  router: PropTypes.object,
  params: PropTypes.object.isRequired,
  switchLanguage: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  paths: PropTypes.array.isRequired,
};

function mapStateToProps(state) {
  return {
    paths: getPosts(state),
  };
}

export default connect(mapStateToProps)(PathListPage);

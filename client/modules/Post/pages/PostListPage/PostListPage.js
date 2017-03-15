import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import MasterLayout from '../../../../layouts/MasterLayout';
import PathList from '../../components/PathList/PathListContainer';
import { LinkButton } from '../../../../mdl/Button';
import styles from './postListPage.scss'; // eslint-disable-line

class PathListPage extends Component { // eslint-disable-line
  render() {
    const { params, switchLanguage, intl } = this.props;
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
        <PathList />
      </MasterLayout>
    );
  }
}

PathListPage.propTypes = {
  params: PropTypes.object.isRequired,
  switchLanguage: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default connect()(PathListPage);

import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import styles from '../../../Post/components/pathList.scss'; // eslint-disable-line

import MasterLayout from '../../../../layouts/MasterLayout';

import { fetchPosts } from '../../../Post/PostActions';

class LoginPage extends Component {
  componentDidMount() {
    this.props.auth.showUI();
  }
  componentWillUnmount() {
    this.props.auth.hideUI();
  }
  render() {
    const { params, auth, switchLanguage, intl } = this.props;
    return (
      <MasterLayout
        params={params}
        auth={auth}
        switchLanguage={switchLanguage}
        intl={intl}
      >
        <div className={styles['no-paths']}><h4>Login</h4></div>
      </MasterLayout>
    );
  }
}

LoginPage.need = [() => { return fetchPosts(); }];

LoginPage.propTypes = {
  router: PropTypes.object,
  auth: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  switchLanguage: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default connect()(LoginPage);

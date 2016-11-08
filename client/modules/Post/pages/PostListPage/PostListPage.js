import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';

import MasterLayout from '../../../../layouts/MasterLayout';
import PathList from '../../components/PathList';

import { getPost, getPosts } from '../../PostReducer';
import { fetchPosts } from '../../PostActions';

class PathListPage extends Component {
  render() {
    const { params, auth, switchLanguage, intl, paths } = this.props;
    return (
      <MasterLayout
        params={params}
        auth={auth}
        switchLanguage={switchLanguage}
        intl={intl}
      >
        <PathList paths={paths} />
      </MasterLayout>
    );
  }
}

PathListPage.need = [() => { return fetchPosts(); }];

PathListPage.propTypes = {
  router: PropTypes.object,
  auth: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  switchLanguage: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  paths: PropTypes.array.isRequired,
};

function mapStateToProps(state, props) {
  return {
    paths: getPosts(state),
    path: getPost(state, props.params.cuid),
  };
}

export default connect(mapStateToProps)(PathListPage);

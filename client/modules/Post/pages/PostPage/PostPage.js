import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import MasterLayout from '../../../../layouts/MasterLayout';
import AuthorList from '../../components/AuthorList/AuthorList';
import Navigator from '../../components/Navigator/Navigator';

import { getPost, getPosts } from '../../PostReducer';

// Import Actions
import { fetchPosts } from '../../PostActions';

class PathPage extends Component {
  componentWillUpdate({params}) {
    if (params.cuid !== this.props.params.cuid) {
      this.props.dispatch(fetchPosts);
    }
  }
  render() {
    const { params, auth, switchLanguage, intl, path, paths, } = this.props;
    return (
      <MasterLayout
        params={params}
        auth={auth}
        switchLanguage={switchLanguage}
        intl={intl}
      >
      {path ?
        <div>
          <AuthorList path={path} />
          <Navigator auth={auth} path={path} paths={paths} />
        </div> :
        <h1>404 Not Found</h1>}
      </MasterLayout>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
PathPage.need = [() => {
  return fetchPosts();
}];


PathPage.propTypes = {
  auth: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  switchLanguage: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  path: PropTypes.object,
  paths: PropTypes.array.isRequired,
};

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    paths: getPosts(state),
    path: getPost(state, props.params.cuid),
  };
}

export default connect(mapStateToProps, dispatch => ({dispatch}))(PathPage);

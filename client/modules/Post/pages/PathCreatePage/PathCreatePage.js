import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import MasterLayout from '../../../../layouts/MasterLayout';
import AuthorList from '../../components/AuthorList/AuthorList';
import Navigator from '../../components/Navigator/Navigator';

import { getNavigator, getPost, getPosts } from '../../PostReducer';

// Import Actions
import { addPost, fetchPosts, toggleMakeMode, deletePost } from '../../PostActions';

class PathCreatePage extends Component {
  componentWillMount() {
    const clone = Object.assign({}, this.props.path, { cuid: '_CLONE'});
    this.props.dispatch(addPost(clone));
  }
  componentDidUpdate() {
    if (!this.props.makeMode) {
      this.props.dispatch(toggleMakeMode());
    }
  }
  render() {
    const { params, auth, switchLanguage, intl, path, paths, } = this.props;
    debugger;
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
  componentWillUnmount() {
    this.props.dispatch(toggleMakeMode());
    this.props.dispatch(deletePost('_CLONE'));
  }
}

// Actions required to provide data for this component to render in sever side.
PathCreatePage.need = [() => {
  return fetchPosts();
}];


PathCreatePage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  switchLanguage: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  path: PropTypes.object,
  paths: PropTypes.array.isRequired,
  makeMode: PropTypes.bool.isRequired,
};

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    ...getNavigator(state),
    paths: getPosts(state),
    path: getPost(state, props.params.cuid),
  };
}

export default connect(mapStateToProps, dispatch => ({dispatch}))(PathCreatePage);

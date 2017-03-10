import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

import MasterLayout from '../../../../layouts/MasterLayout';
import AuthorList from '../../components/AuthorList/AuthorList';
import Navigator from '../../components/Navigator/Navigator';

import { getPost } from '../../PostReducer';

// Import Actions
import { fetchPosts } from '../../PostActions';

class PathPage extends Component { // eslint-disable-line
  render() {
    const { params, switchLanguage, intl, path } = this.props;
    return (
      <MasterLayout
        user={{}}
        switchLanguage={switchLanguage}
        intl={intl}
      >
        {path &&
          <div>
            <AuthorList user={{}} path={path} />
            <Navigator user={{}} params={params} path={path} />
          </div>
        }
        {!path &&
          <h1>404 Not Found</h1>
        }
      </MasterLayout>
    );
  }
}

// Actions required to provide data for this component to render in sever side.
PathPage.need = [() => {
  return fetchPosts();
}];


PathPage.propTypes = {
  params: PropTypes.object.isRequired,
  switchLanguage: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
  path: PropTypes.object,
};

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    path: getPost(state, props.params.sid),
  };
}

export default connect(mapStateToProps, dispatch => ({dispatch}))(PathPage);

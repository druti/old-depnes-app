// eslint-disable-next-line no-unused-vars
import React, { Component, PropTypes as T } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { setRedirectUrl } from '../../App/AppActions';
import { getCurrentUser } from '../AuthReducer';

class RequireAuthContainer extends Component {
  componentDidMount() {
    const { user, dispatch, location } = this.props

    if (!user) {
      dispatch(setRedirectUrl(location.pathname))
      browserHistory.replace('/login')
    }
  }

  render() {
    const { user, children } = this.props;
    if (user) {
      return children;
    } else {
      return null;
    }
  }
}

function mapStateToProps(state) {
  return {
    user: getCurrentUser(state),
  }
}

RequireAuthContainer.propTypes = {
  children: T.any.isRequired,
  user: T.object,
  location: T.object.isRequired,
  dispatch: T.func.isRequired,
};

export default connect(mapStateToProps, dispatch => ({dispatch}))(RequireAuthContainer);

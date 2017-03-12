import React, { Component, PropTypes as T } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { getUser } from '../AuthReducer';

export default function (ComposedComponent) {
  class Authentication extends Component {
    componentWillMount() {
      if (!this.props.user) {
        browserHistory.push('/login');
      }
    }

    componentWillUpdate(nextProps) {
      if (!nextProps.user) {
        browserHistory.push('/login');
      }
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }

  Authentication.propTypes = {
    user: T.object,
  };

  return connect(state => ({ user: getUser(state)}))(Authentication);
}

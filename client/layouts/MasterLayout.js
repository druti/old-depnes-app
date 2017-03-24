import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Layout, Panel } from 'react-toolbox';
import { NavDrawer } from 'react-toolbox/lib/layout';

import { logOutUser } from '../modules/Auth/AuthActions';
import { getCurrentUser } from '../modules/Auth/AuthReducer';

import AppBar from './AppBar';
import DrawerMenu from './DrawerMenu';

import drawerTheme from './drawerMenu.scss'; // eslint-disable-line
import buttonTheme from './button.scss'; // eslint-disable-line

class MasterLayout extends React.Component {
  constructor() {
    super();

    this.state = {
      drawerActive: false,
      drawerPinned: false,
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
    this.handleProfile = this.handleProfile.bind(this);
    this.handleLogOut = this.handleLogOut.bind(this);
  }

  componentDidMount() {
    // `DidMount` instead of `WillMount` because window is not available on
    // server for SSR
    this.lg = 840;

    this.viewportW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    window.onresize = () => {
      this.viewportW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    };
  }

  toggleDrawer() {
    if (this.viewportW > this.lg) {
      this.setState({
        drawerPinned: !this.state.drawerPinned,
        drawerActive: false,
      });
    } else {
      this.setState({
        drawerActive: !this.state.drawerActive,
        drawerPinned: false,
      });
    }
  }

  handleProfile() {
    browserHistory.push(`/user/${this.props.user.sid}`);
  }

  handleLogOut() {
    this.props.dispatch(logOutUser());
  }

  render() {
    const { user } = this.props;
    return (
      <Layout theme={drawerTheme}>
        <NavDrawer
          active={this.state.drawerActive}
          pinned={this.state.drawerPinned}
          onOverlayClick={this.toggleDrawer}
          scrollY
        >
          <DrawerMenu />
        </NavDrawer>
        <Panel>
          <AppBar
            user={user}
            toggleDrawer={this.toggleDrawer}
            handleProfile={this.handleProfile}
            handleLogOut={this.handleLogOut}
          />
          <div style={{flex: 1, overflowY: 'auto', background: '#fff'}}>
            {this.props.children}
          </div>
        </Panel>
      </Layout>
    );
  }
}

MasterLayout.propTypes = {
  user: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  switchLanguage: PropTypes.func,
  intl: PropTypes.object,
  children: PropTypes.any,
};

function mapStateToProps(state) {
  return {
    user: getCurrentUser(state),
  };
}

export default connect(mapStateToProps, dispatch => ({dispatch}))(MasterLayout);

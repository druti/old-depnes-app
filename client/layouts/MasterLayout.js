import React, {PropTypes} from 'react';
import $ from 'jquery';
import {Layout, Panel} from 'react-toolbox';
import {NavDrawer} from 'react-toolbox/lib/layout';

import DrawerMenu from './DrawerMenu';
import AppBar from '../modules/Post/components/Navigator/Toolbar';

import theme from './masterLayout.scss'; // eslint-disable-line
import drawerTheme from './drawerMenu.scss'; // eslint-disable-line

class MasterLayout extends React.Component {
  constructor() {
    super();

    this.state = {
      drawerActive: false,
      drawerPinned: false,
      userProfile: null,
    };

    if (typeof window !== 'undefined') {
      this.authConfig = {
        initialScreen: 'login',
        auth: {
          params: {
            state: JSON.stringify({
              pathname: window.location.pathname + window.location.search + window.location.hash,
            }),
          },
        },
      };
    }
  }

  componentWillMount() {
    this.props.auth.on('profile_updated', profile => {
      this.setState(profile);
    });
  }

  componentDidMount() {
    // `DidMount` instead of `WillMount` because window is not available on
    // server for SSR
    this.lg = 840;

    this.viewportW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    $(window).on('resize', () => {
      this.viewportW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    });
  }

  toggleDrawer = () => {
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
  };

  logIn = () => {
    const { auth } = this.props;
    auth.showUI(
      Object.assign(
        this.authConfig, {
          initialScreen: 'login',
        }
      )
    );
  };

  signUp = () => {
    const { auth } = this.props;
    auth.showUI(
      Object.assign(
        this.authConfig, {
          initialScreen: 'signUp',
        }
      )
    );
  };

  logOut = () => {
    const { auth } = this.props;
    auth.logout();
    location.reload();
  };

  render() {
    const { auth, params } = this.props;
    return (
      <Layout theme={drawerTheme}>
        <NavDrawer
          active={this.state.drawerActive}
          pinned={this.state.drawerPinned}
          onOverlayClick={this.toggleDrawer}
          scrollY
        >
          <DrawerMenu/>
        </NavDrawer>
        <Panel>
          <AppBar
            auth={auth}
            params={params}
            theme={theme}
            toggleDrawer={this.toggleDrawer}
            signUp={this.signUp}
            logIn={this.logIn}
          />
          <div style={{flex: 1, overflowY: 'auto'}}>
            {this.props.children}
          </div>
        </Panel>
      </Layout>
    );
  }
}

MasterLayout.propTypes = {
  params: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  switchLanguage: PropTypes.func,
  intl: PropTypes.object,
  children: PropTypes.object,
};

export default MasterLayout;

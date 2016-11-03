import React, {PropTypes} from 'react';
import $ from 'jquery';
import {Layout, NavDrawer, Panel} from 'react-toolbox';
import {AppBar} from 'react-toolbox/lib/app_bar';
import {Button, IconButton} from 'react-toolbox/lib/button';

import DrawerMenu from './DrawerMenu';
import Toolbar from '../modules/Post/components/Navigator/Toolbar';

const theme = require('./masterLayout.scss');

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
    const { params, auth } = this.props;
    return (
      <Layout>
        <NavDrawer
          active={this.state.drawerActive}
          pinned={this.state.drawerPinned}
          onOverlayClick={this.toggleDrawer}
          scrollY
        >
          <DrawerMenu/>
        </NavDrawer>
        <Panel>
          <AppBar theme={theme}>
            <IconButton icon='menu' inverse onClick={this.toggleDrawer}/>
            <Toolbar auth={auth} params={params} />
            {auth.loggedIn() ?
              <div className={theme.appBarUser}>
                <Button
                  accent
                  label='Profile'
                  onClick={() => /*eslint-disable*/console.log(auth.getProfile())/*eslint-enable*/ }
                />
                <Button label='Log out' onClick={this.logOut} accent /> {/* TODO move to user panel */}
              </div> :
              <div className={theme.appBarUser}>
                <Button label='Sign Up' onClick={this.signUp} accent />
                <Button label='Log In' onClick={this.logIn} accent />
              </div>
            }
          </AppBar>
          <div style={{flex: 1, overflowY: 'auto', padding: '1.8rem'}}>
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

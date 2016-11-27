import $ from 'jquery';
import React, { PropTypes } from 'react';
import { Layout, Panel } from 'react-toolbox';
import { NavDrawer } from 'react-toolbox/lib/layout';
import { Button, IconButton } from 'react-toolbox/lib/button';

import ButtonBar from '../components/ButtonBar';
import DrawerMenu from './DrawerMenu';

import { LinkButton } from '../mdl/Button';

import theme from './masterLayout.scss'; // eslint-disable-line
import drawerTheme from './drawerMenu.scss'; // eslint-disable-line
import buttonTheme from './button.scss'; // eslint-disable-line

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
    const { auth } = this.props;
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
          <ButtonBar theme={theme}>
            <IconButton icon='menu' onClick={this.toggleDrawer} theme={buttonTheme} />
            <Button
              theme={buttonTheme}
              label='Read'
            />
            <LinkButton
              label='Write'
              href='/paths/blank'
              theme={buttonTheme}
            />
            {auth.loggedIn() &&
              <Button
                theme={buttonTheme}
                label={auth.getProfile().username || auth.getProfile().nickname}
                className={theme.username}
                onClick={() => { auth.logout(); location.reload(); }}
              />
            }
            {!auth.loggedIn() &&
              <Button label='Log In' onClick={this.logIn} theme={buttonTheme} />
            }
            {!auth.loggedIn() &&
              <Button label='Sign Up' onClick={this.signUp} theme={buttonTheme} />
            }
          </ButtonBar>
          <div style={{flex: 1, overflowY: 'auto', background: '#fff'}}>
            {this.props.children}
          </div>
        </Panel>
      </Layout>
    );
  }
}

MasterLayout.propTypes = {
  auth: PropTypes.object.isRequired,
  switchLanguage: PropTypes.func,
  intl: PropTypes.object,
  children: PropTypes.any.isRequired,
};

export default MasterLayout;

import React, { PropTypes } from 'react';
import { Layout, Panel } from 'react-toolbox';
import { NavDrawer } from 'react-toolbox/lib/layout';
import { Button, IconButton } from 'react-toolbox/lib/button';

import ButtonBar from '../components/ButtonBar';
import DrawerMenu from './DrawerMenu';

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
  };

  signUp = () => {
  };

  logOut = () => {
  };

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
          <DrawerMenu/>
        </NavDrawer>
        <Panel>
          <ButtonBar theme={theme}>
            <IconButton icon='menu' onClick={this.toggleDrawer} theme={buttonTheme} />
            {user &&
              <Button
                theme={buttonTheme}
                label={user.username || user.email}
                className={theme.username}
                onClick={this.logOut()}
              />
            }
            {!user &&
              <Button label='Log In' onClick={this.logIn} theme={buttonTheme} />
            }
            {!user &&
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
  user: PropTypes.object.isRequired,
  switchLanguage: PropTypes.func,
  intl: PropTypes.object,
  children: PropTypes.any.isRequired,
};

export default MasterLayout;

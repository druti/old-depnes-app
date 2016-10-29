import React, {PropTypes} from 'react';
import $ from 'jquery';
import {Layout, NavDrawer, Panel} from 'react-toolbox';
import {AppBar} from 'react-toolbox/lib/app_bar';
import {Checkbox} from 'react-toolbox/lib/checkbox';
import {Button, IconButton} from 'react-toolbox/lib/button';

import DrawerMenu from './DrawerMenu';
const theme = require('./masterLayout.scss');

class MasterLayout extends React.Component {
  constructor() {
    super();

    this.state = {
      drawerActive: false,
      drawerPinned: false,
    };

    this.showLock = this.showLock.bind(this);
  }

  componentDidMount() {
    // `DidMount` instead of `WillMount` because window is not available on
    // server for SSR
    this.lg = 840;

    $(window).on('resize', e => {
      this.viewportW = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    });
  }

  showLock(options) {
    this.props.lock.show(
        Object.assign({}, options),
    );
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

  render() {
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
            {this.props.idToken ?
              <Button label='Profile' onClick={() => console.log(this.props.idToken)} accent /> :
              <div>
                <Button label='Sign Up' onClick={() => this.showLock({initialScreen: 'signUp'})} accent />
                <Button label='Log In' onClick={() => this.showLock({initialScreen: 'login'})} accent />
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
  auth: PropTypes.object,
  switchLanguage: PropTypes.func,
  intl: PropTypes.object,
  children: PropTypes.object,
};

export default MasterLayout;

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Layout, Panel } from 'react-toolbox';
import { NavDrawer } from 'react-toolbox/lib/layout';
import { IconButton } from 'react-toolbox/lib/button';

import { getCurrentUser } from '../modules/Auth/AuthReducer';

import { LinkButton } from '../mdl/Button';
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
    };

    this.toggleDrawer = this.toggleDrawer.bind(this);
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
              <LinkButton
                href={`/user/${user.sid}`}
                label={`${user.firstName} ${user.lastName}`}
                theme={buttonTheme}
                className={theme.username}
              />
            }
            {!user &&
              <LinkButton
                href='/login'
                label='Log In'
                theme={buttonTheme}
              />
            }
            {!user &&
              <LinkButton
                href='/signup'
                label='Sign Up'
                theme={buttonTheme}
              />
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
  user: PropTypes.object,
  dispatch: PropTypes.func.isRequired,
  switchLanguage: PropTypes.func,
  intl: PropTypes.object,
  children: PropTypes.any.isRequired,
};

function mapStateToProps(state) {
  return {
    user: getCurrentUser(state),
  };
}

export default connect(mapStateToProps, dispatch => ({dispatch}))(MasterLayout);

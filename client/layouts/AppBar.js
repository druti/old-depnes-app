import React, { PropTypes as T } from 'react';
import {IconMenu, MenuItem, MenuDivider } from 'react-toolbox/lib/menu';

import { LinkButton } from '../mdl/Button';
import { AppBar as ToolboxAppBar } from 'react-toolbox/lib/app_bar';

import theme from './appBar.scss'; // eslint-disable-line
import drawerTheme from './drawerMenu.scss'; // eslint-disable-line
import buttonTheme from './button.scss'; // eslint-disable-line

const AppBar = ({ user, toggleDrawer, handleProfile, handleLogOut }) => {
  return (
    <ToolboxAppBar
      theme={theme}
      leftIcon='menu'
      onLeftIconClick={toggleDrawer}
    >
      <div className={theme.container}>
        {!user &&
          <LinkButton
            href='/login'
            label='Log In'
            theme={buttonTheme}
          />}
        {!user &&
          <LinkButton
            href='/signup'
            label='Sign Up'
            theme={buttonTheme}
          />}
        {user &&
          <IconMenu icon='more_vert' position='topRight' menuRipple>
            <MenuItem
              icon='account_circle'
              caption={`${user.firstName} ${user.lastName}`}
              onClick={handleProfile}
            />
            <MenuDivider />
            <MenuItem
              icon='power_settings_new'
              caption='Log Out'
              onClick={handleLogOut}
            />
          </IconMenu>}
      </div>
    </ToolboxAppBar>
  );
};

AppBar.propTypes = {
  user: T.object,
  toggleDrawer: T.func.isRequired,
  handleProfile: T.func.isRequired,
  handleLogOut: T.func.isRequired,
};

export default AppBar;
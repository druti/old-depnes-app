import React, { PropTypes as T } from 'react';
import Navigation from 'react-toolbox/lib/navigation/Navigation';

import Link from '../mdl/Link';

import Logo from '../modules/App/components/Logo/Logo';

import theme from './drawerMenu.scss'; // eslint-disable-line

const DrawerMenu = ({ handleLinkClick }) => (
  <Navigation theme={theme} type='vertical'>
    <Logo />
    <Link onClick={handleLinkClick} href='/paths/blank' label='Write'/>
    <Link onClick={handleLinkClick} href='/paths' label='Paths'/>
  </Navigation>
);

DrawerMenu.propTypes = {
  handleLinkClick: T.func,
};

export default DrawerMenu;

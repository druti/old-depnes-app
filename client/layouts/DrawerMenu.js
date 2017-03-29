import React, { PropTypes as T } from 'react';
import Navigation from 'react-toolbox/lib/navigation/Navigation';

import Link from '../mdl/Link';

import Logo from '../modules/App/components/Logo/Logo';

import theme from './drawerMenu.scss'; // eslint-disable-line

const DrawerMenu = ({ handleLinkClick }) => (
  <Navigation theme={theme} type='vertical'>
    <Logo />
    <Link onClick={handleLinkClick} href='/posts/new' label='Write'/>
    <Link onClick={handleLinkClick} href='/posts' label='Posts'/>
  </Navigation>
);

DrawerMenu.propTypes = {
  handleLinkClick: T.func,
};

export default DrawerMenu;

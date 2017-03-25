import React from 'react';
import Navigation from 'react-toolbox/lib/navigation/Navigation';

import Link from '../mdl/Link';

import Logo from '../modules/App/components/Logo/Logo';

import theme from './drawerMenu.scss'; // eslint-disable-line

const DrawerMenu = () => (
  <Navigation theme={theme} type='vertical'>
    <Logo />
    <Link href='/paths/blank' label='Write'/>
    <Link href='/paths' label='Paths'/>
    <Link href='/paths/dafdfafsdf' label='Daf Path'/>
    <Link href='/user/Sy2HGXzig' label='Andres Profile'/>
    <Link href='/user/dafdfafsdf' label='Daf Profile'/>
  </Navigation>
);

export default DrawerMenu;


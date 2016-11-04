import React from 'react';
import { Navigation } from 'react-toolbox/lib/navigation';

import Link from '../mdl/Link';

import Logo from '../modules/App/components/Logo/Logo';

const DrawerMenu = () => (
  <Navigation type='vertical'>
    <Logo />
    <Link href='/paths' label='Paths' icon='explore'/>
  </Navigation>
);

export default DrawerMenu;


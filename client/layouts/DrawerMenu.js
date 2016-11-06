import React from 'react';
import { Navigation } from 'react-toolbox/lib/navigation';

import Link from '../mdl/Link';

import Logo from '../modules/App/components/Logo/Logo';

import styles from './drawerMenu.scss';

const DrawerMenu = () => (
  <div className={styles.menuContainer}>
    <Logo />
    <Navigation type='vertical'>
      <Link href='/paths' label='Paths'/>
    </Navigation>
  </div>
);

export default DrawerMenu;


import React from 'react';
import { Navigation } from 'react-toolbox/lib/navigation';

import Link from '../mdl/Link';

import Logo from '../modules/App/components/Logo/Logo';

import styles from './drawerMenu.scss'; // eslint-disable-line

const DrawerMenu = () => (
  <div className={styles.menuContainer}>
    <Logo />
    <Navigation type='vertical'>
      <Link href='/paths/blank' label='Write'/>
      <Link href='/paths' label='Paths'/>
      <Link href='/paths/dafdfafsdf' label='Daf Path'/>
      <Link href='/user/Sy2HGXzig' label='Andres Profile'/>
      <Link href='/user/dafdfafsdf' label='Daf Profile'/>
    </Navigation>
  </div>
);

export default DrawerMenu;


import React from 'react';
import { Navigation } from 'react-toolbox/lib/navigation';

import Link from '../mdl/Link';

const DrawerMenu = () => (
  <Navigation type='vertical'>
    <Link href='/paths' label='Paths' icon='explore'/>
  </Navigation>
);

export default DrawerMenu;


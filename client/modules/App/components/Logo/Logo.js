import React from 'react';
import LogoImg from '../../assets/images/logo.png' // eslint-disable-line

import styles from './styles.scss';

const Logo = () => {
  return <img className={styles.logoImg} src={LogoImg} alt='Logo' />;
};

export default Logo;

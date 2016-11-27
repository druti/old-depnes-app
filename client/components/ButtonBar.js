import React, { PropTypes } from 'react';
import { AppBar as ToolboxAppBar } from 'react-toolbox/lib/app_bar';
import { Scrollbars } from 'react-custom-scrollbars';

import styles from './buttonBar.scss'; // eslint-disable-line
import buttonTheme from '../layouts/button.scss'; // eslint-disable-line

const ButtonBar = ({ children, theme }) => (
    <ToolboxAppBar theme={theme}>
      <Scrollbars className={styles.scroller}>
        <div className={styles.container}>
          {children}
        </div>
      </Scrollbars>
    </ToolboxAppBar >
);

ButtonBar.propTypes = {
  children: PropTypes.any.isRequired,
  theme: PropTypes.object.isRequired,
  className: PropTypes.string,
};

export default ButtonBar;

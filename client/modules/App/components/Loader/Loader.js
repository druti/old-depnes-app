import React from 'react';
import ProgressBar from 'react-toolbox/lib/progress_bar';

const Spinner = () => (
  <div style={{ textAlign: 'center' }}>
    <ProgressBar mode='indeterminate' />
  </div>
);

export default Spinner;

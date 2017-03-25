import React, { PropTypes as T } from 'react';

import Input from 'react-toolbox/lib/input/Input';

export const FormInput = ({ input, meta: { touched, error }, ...custom }) => {
  return (
    <Input
      error={touched && error ? error : ''}
      {...input}
      {...custom}
    />
  );
};

FormInput.propTypes = {
  input: T.object,
  meta: T.object,
};

export default FormInput;

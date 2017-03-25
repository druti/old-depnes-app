import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { registerUser, errorReset } from '../../AuthActions';
import MasterLayout from '../../../../layouts/MasterLayout';
//import { fetchPosts } from '../../../Post/PostActions';

import { validateEmail } from '../../../../util/form';

import Button from 'react-toolbox/lib/button/Button';
import FormInput from '../../../../mdl/FormInput';

// eslint-disable-next-line
import styles from '../Login/styles.scss';

const form = reduxForm({
  form: 'register',
  validate,
});

function validate({ firstName, lastName, email, password }) {
  const errors = {};

  if (!firstName) {
    errors.firstName = 'Please enter a first name';
  }
  if (!lastName) {
    errors.lastName = 'Please enter a last name';
  }
  if (!email) {
    errors.email = 'Please enter an email';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email';
  }
  if (!password) {
    errors.password = 'Please enter a password';
  } else if (password.length < 6) {
    errors.password = 'Password must be six characters or more';
  }
  return errors;
}


class RegisterPage extends Component {
  constructor(props) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillMount() {
    this.props.errorReset();
  }

  handleFormSubmit(formProps) {
    this.props.registerUser(formProps);
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div className={styles.alert}>
          <span>{this.props.errorMessage}</span>
        </div>
      );
    }
  }

  render() {
    const { params, switchLanguage, intl, handleSubmit } = this.props;

    return (
      <MasterLayout
        params={params}
        switchLanguage={switchLanguage}
        intl={intl}
      >
        <form
          className={styles.form}
          onSubmit={handleSubmit(this.handleFormSubmit)}
        >
          <h3 className={styles.title}>Join Depnes</h3>
          <Field
            type='text'
            name='firstName'
            icon='person_outline'
            label='First Name'
            component={FormInput}
          />
          <Field
            type='text'
            name='lastName'
            icon='person'
            label='Last Name'
            component={FormInput}
          />
          <Field
            type='text'
            name='email'
            icon='email'
            label='Email'
            component={FormInput}
          />
          <Field
            type='password'
            name='password'
            icon='security'
            label='Password'
            component={FormInput}
          />
          {this.renderAlert()}
          <Button label='Sign Up' type='submit' raised primary />
        </form>
      </MasterLayout>
    );
  }
}

RegisterPage.need = [];

RegisterPage.propTypes = {
  router: T.object,
  params: T.object.isRequired,
  switchLanguage: T.func.isRequired,
  intl: T.object.isRequired,
  registerUser: T.func.isRequired,
  errorReset: T.func.isRequired,
  handleSubmit: T.func.isRequired,
  errorMessage: T.node,
};

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.error,
  };
}

export default connect(mapStateToProps, { registerUser, errorReset })(form(RegisterPage));

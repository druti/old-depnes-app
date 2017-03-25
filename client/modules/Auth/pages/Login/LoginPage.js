import React, { PropTypes as T, Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { logInUser, errorReset } from '../../AuthActions';
import MasterLayout from '../../../../layouts/MasterLayout';
import { getRedirectUrl } from '../../../App/AppReducer';

import { validateEmail } from '../../../../util/form';

import Button from 'react-toolbox/lib/button/Button';
import FormInput from '../../../../mdl/FormInput';

// eslint-disable-next-line
import styles from './styles.scss';

const form = reduxForm({
  form: 'login',
  validate,
});

function validate({ email, password }) {
  const errors = {};

  if (!email) {
    errors.email = 'Please enter an email';
  } else if (!validateEmail(email)) {
    errors.email = 'Please enter a valid email';
  }
  if (!password) {
    errors.password = 'Please enter a password';
  } else if (password.length < 6) {
    errors.password = 'Invalid password';
  }
  return errors;
}

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  componentWillMount() {
    this.props.errorReset();
  }

  handleFormSubmit(formProps) {
    this.props.logInUser(formProps, this.props.redirectUrl);
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
          <h3 className={styles.title}>Enter Depnes</h3>
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
          <Button label='Log in' type='submit' raised primary />
        </form>
      </MasterLayout>
    );
  }
}

LoginPage.need = [];

LoginPage.propTypes = {
  redirectUrl: T.string,
  router: T.object,
  params: T.object.isRequired,
  switchLanguage: T.func.isRequired,
  intl: T.object.isRequired,
  handleSubmit: T.func.isRequired,
  errorMessage: T.node,
  logInUser: T.func.isRequired,
  errorReset: T.func.isRequired,
};

function mapStateToProps(state) {
  return {
    redirectUrl: getRedirectUrl(state),
    errorMessage: state.auth.error,
  };
}

export default connect(mapStateToProps, { logInUser, errorReset })(form(LoginPage));

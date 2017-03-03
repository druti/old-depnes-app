import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { registerUser } from '../../AppActions';
import MasterLayout from '../../../../layouts/MasterLayout';
//import { fetchPosts } from '../../../Post/PostActions';

const form = reduxForm({
  form: 'register',
  validate,
});

const renderField = field => (
  <div>
    <input className='form-control' {...field.input} />
    {field.touched && field.error &&
      <div className='error'>{field.error}</div>}
  </div>
);

function validate(formProps) {
  const errors = {};

  if (!formProps.firstName) {
    errors.firstName = 'Please enter a first name';
  }
  if (!formProps.lastName) {
    errors.lastName = 'Please enter a last name';
  }
  if (!formProps.email) {
    errors.email = 'Please enter an email';
  }
  if (!formProps.password) {
    errors.password = 'Please enter a password';
  }
  return errors;
}

class RegisterPage extends Component {
  constructor(props) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(formProps) {
    this.props.registerUser(formProps);
  }

  renderAlert() {
    if (this.props.errorMessage) {
      return (
        <div>
          <span><strong>Error!</strong> {this.props.errorMessage}</span>
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
        <form onSubmit={handleSubmit(this.handleFormSubmit)}>
          {this.renderAlert()}
          <Field placeholder='firstName' name='firstName' componenent={renderField} type='text' />
          <Field placeholder='lastName' name='lastName' componenent={renderField} type='text' />
          <Field placeholder='email' name='email' componenent={renderField} type='text' />
          <Field placeholder='password' name='password' componenent={renderField} type='password' />
          <button type='submit'>Register</button>
        </form>
      </MasterLayout>
    );
  }
}

//RegisterPage.need = [() => { return fetchPosts(); }];

RegisterPage.propTypes = {
  router: T.object,
  params: T.object.isRequired,
  switchLanguage: T.func.isRequired,
  intl: T.object.isRequired,
  registerUser: T.func.isRequired,
  handleSubmit: T.func.isRequired,
  errorMessage: T.node,
};

function mapStateToProps(state) {
  return {
    errorMessage: state.app.error,
    message: state.app.message,
  };
}

export default connect(mapStateToProps, { registerUser })(form(RegisterPage));

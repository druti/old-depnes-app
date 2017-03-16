import React, { PropTypes as T, Component } from 'react';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { logInUser } from '../../AuthActions';
import MasterLayout from '../../../../layouts/MasterLayout';
import { getRedirectUrl } from '../../../App/AppReducer';

const form = reduxForm({
  form: 'login',
});

class LoginPage extends Component {
  constructor(props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(formProps) {
    this.props.dispatch(logInUser(formProps, this.props.redirectUrl));
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
          <Field placeholder='email' name='email' component='input' type='text' />
          <Field placeholder='password' name='password' component='input' type='password' />
          <button type='submit'>Login</button>
        </form>
      </MasterLayout>
    );
  }
}

// LoginPage.need = [() => { return fetchPosts(); }];

LoginPage.propTypes = {
  redirectUrl: T.string,
  router: T.object,
  params: T.object.isRequired,
  dispatch: T.func.isRequired,
  switchLanguage: T.func.isRequired,
  intl: T.object.isRequired,
  handleSubmit: T.func.isRequired,
  errorMessage: T.node,
};

function mapStateToProps(state) {
  return {
    redirectUrl: getRedirectUrl(state),
    errorMessage: state.auth.error,
  };
}

export default connect(mapStateToProps, dispatch => ({dispatch}))(form(LoginPage));

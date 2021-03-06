import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import cookie from 'react-cookie';

import theme from '../../toolbox/theme.js';
import ThemeProvider from 'react-toolbox/lib/ThemeProvider';

import Helmet from 'react-helmet';
import DevTools from './components/DevTools';
import Dialogs from './components/Dialogs/Dialogs';

import { AUTH_USER } from '../Auth/AuthActions';
import { switchLanguage } from '../../modules/Intl/IntlActions';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isMounted: false };
  }

  componentWillMount() {
    const user = cookie.load('user');
    if (user) {
      this.props.dispatch({ type: AUTH_USER, user });
    }
  }

  componentDidMount() {
    this.setState({isMounted: true}); // eslint-disable-line
  }

  render() {
    let child = null;
    if (this.props.children) {
      child = React.cloneElement(this.props.children, {
        params: this.props.params,
        switchLanguage: lang => this.props.dispatch(switchLanguage(lang)),
        intl: this.props.intl,
      });
    }

    return (
      <div>
        {this.state.isMounted && !window.devToolsExtension && process.env.NODE_ENV === 'development' && <DevTools />}
        <div>
          <Helmet
            title='Depnes'
            titleTemplate='%s - Depnes'
            meta={[
              { charset: 'utf-8' },
              {
                'http-equiv': 'X-UA-Compatible',
                content: 'IE=edge',
              },
              {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
              },
            ]}
            link={[
              {
                rel: 'stylesheet',
                href: 'https://cdnjs.cloudflare.com/ajax/libs/normalize/5.0.0/normalize.min.css',
              },
              {
                rel: 'stylesheet',
                href: 'https://fonts.googleapis.com/icon?family=Material+Icons',
              },
              {
                rel: 'stylesheet',
                href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css',
              },
            ]}
          />
          <ThemeProvider theme={theme}>
            <div style={{ height: '100%' }}>
              {child}
              <Dialogs />
            </div>
          </ThemeProvider>
        </div>
      </div>
    );
  }
}

App.propTypes = {
  params: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

// Retrieve data from store as props
function mapStateToProps(store) {
  return {
    intl: store.intl,
  };
}

export default connect(mapStateToProps, dispatch => ({ dispatch }))(App);

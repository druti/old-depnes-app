import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

// Import Components
import Helmet from 'react-helmet';
import DevTools from './components/DevTools';

// Import Actions
import { toggleMakePath } from './AppActions';
import { switchLanguage } from '../../modules/Intl/IntlActions';

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = { isMounted: false };
  }

  componentDidMount() {
    this.setState({isMounted: true}); // eslint-disable-line
  }

  toggleMakePathSection = () => {
    this.props.dispatch(toggleMakePath());
  };

  render() {
    let child = null;
    if (this.props.children) {
      child = React.cloneElement(this.props.children, {
        auth: this.props.route.auth, //sends auth instance from route to child
        params: this.props.params,
        switchLanguage: lang => this.props.dispatch(switchLanguage(lang)),
        intl: this.props.intl,
        toggleMakePath: this.toggleMakePathSection,
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
                href: 'https://cdn.quilljs.com/1.1.3/quill.snow.css',
              },

            ]}
          />
          {child}
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

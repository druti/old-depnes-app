import React, { PropTypes } from 'react';
import $ from 'jquery';
import EventEmitter from 'events';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import Editor from './Editor';

import styles from './styles.scss'; // eslint-disable-line

// Import Actions
import { updateNavigator } from '../../PostActions';

// Import Selectors
import { getNavigator } from '../../PostReducer';

export const navigatorEmitter = new EventEmitter();

const isClient = typeof window !== 'undefined'
if (isClient) {
  window.$ = $;
}

class Navigator extends React.Component {
  constructor(props) {
    super(props);

    //this.onNavigatorViewClick = this.onNavigatorViewClick.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
  }

  componentDidUpdate() {
    navigatorEmitter.emit('componentDidUpdate');
  }

  onEditorChange(delta, editor) {
    this.props.dispatch(updateNavigator({
      content: delta,
      htmlContent: $(editor.root).html(),
      textContent: editor.getText(),
    }));
  }

  //onNavigatorViewClick() {
  //  placeCursor();
  //}

  render() {
    const {
      path,
      makeMode,
      content,
      htmlContent,
      textContent,
    } = this.props;

    if (!path) {
      return <h1>404 Not Found</h1>;
    }

    let View;

    if (makeMode) {
      View = (
        <Editor
          content={content}
          htmlContent={htmlContent}
          textContent={textContent}
          onChange={this.onEditorChange}
        />
      );
    } else {
      View = (
        <div
          id='navigator-view'
          dangerouslySetInnerHTML={{__html: this.props.path.htmlContent}}
        />
      );
    }

    return (
      <div className={styles.navigator}>
        <Helmet title={this.props.path.textContent.substring(0, 25)} />
        {View}
      </div>
    );
  }
}

Navigator.propTypes = {
  dispatch: PropTypes.func.isRequired,
  makeMode: PropTypes.bool.isRequired,
  content: PropTypes.object,
  htmlContent: PropTypes.string,
  textContent: PropTypes.string,
  path: PropTypes.object,
  paths: PropTypes.array,
  className: PropTypes.string,
};

// Retrieve data from store as props
function mapStateToProps(state) {
  return {
    ...getNavigator(state),
  };
}

export default connect(mapStateToProps, dispatch => ({ dispatch }))(Navigator);

import React, { PropTypes } from 'react';
import $ from 'jquery';
import EventEmitter from 'events';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import { deltaToString } from '../../../../util/delta';

import Editor from './Editor';

import styles from './styles.scss'; // eslint-disable-line

// Import Actions
import { updateEditorPath } from '../../PostActions';

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

  onEditorChange(content) {
    this.props.dispatch(updateEditorPath({content, cuid: this.props.path.cuid}));
  }

  render() {
    const {
      auth,
      path,
      makeMode,
    } = this.props;

    let View;

    return (
      <div className={styles.container}>
        <Helmet title={deltaToString(path.content, 30)} />
        <Editor
          auth={auth}
          readOnly={!makeMode}
          content={path.content}
          onChange={this.onEditorChange}
        />
      </div>
    );
  }
}

Navigator.propTypes = {
  auth: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  makeMode: PropTypes.bool.isRequired,
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

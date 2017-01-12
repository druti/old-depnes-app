import React, { Component, PropTypes as Type } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import Editor from './Editor';
import Toolbar from './Toolbar';

import { elementContainsSelection } from '../../../../util/selection';
import { insertElementInTextNode, isNodeTypeText } from '../../../../util/domNode';
import { deltaToString } from '../../../../util/delta';

import { getDefaultSelectionOffsets } from './customSelect';

import { getNavigator } from '../../PostReducer';

import styles from './styles.scss'; // eslint-disable-line

class Navigator extends Component {
  constructor() {
    super();
    this.state = {};
    this.handleContentClick = this.handleContentClick.bind(this);
  }

  handleContentClick() {
    if (elementContainsSelection(this.refs.content)) {
      console.log('content contains the selection'); // eslint-disable-line
      this.initCustomSelect();
    } else {
      console.error('ERROR'); // eslint-disable-line
      debugger; // eslint-disable-line
    }
  }

  initCustomSelect() {
    const startMarker = '<span id="custom-select-start-marker"></span>';
    const endMarker = '<span id="custom-select-end-marker"></span>';
    const selection = window.getSelection();
    const { anchorNode, anchorOffset } = selection;

    if (isNodeTypeText(anchorNode)) {
      const defaultOffsets = getDefaultSelectionOffsets(anchorNode, anchorOffset);

      insertElementInTextNode(startMarker, anchorNode, defaultOffsets[0]);

      const startMarkerEl = document.getElementById('custom-select-start-marker');
      const afterNode = startMarkerEl.nextSibling;

      insertElementInTextNode(endMarker, afterNode, defaultOffsets[1]);

      console.log('initCustomSelect'); // eslint-disable-line
    } else {
      console.error('ERROR trying to init custom select, anchorNode is not a text node'); // eslint-disable-line
      debugger; // eslint-disable-line
    }
  }

  render() {
    const { auth, params, makeMode, path } = this.props;
    return (
      <div className={styles.container}>
        <Helmet title={deltaToString(this.props.path.content, 30)} />
        {makeMode ?
          <Editor
            auth={auth}
            params={params}
            path={path}
          /> :
          <div className='ql-container'>
            <div
              ref='content'
              className='ql-editor'
              onClick={this.handleContentClick}
              dangerouslySetInnerHTML={{ __html: path.htmlContent }}
            />
          </div>
        }
        <Toolbar auth={auth} params={params} />
      </div>
    );
  }
}

Navigator.propTypes = {
  auth: Type.object.isRequired,
  params: Type.object.isRequired,
  path: Type.object.isRequired,
  makeMode: Type.bool.isRequired,
  dispatch: Type.func.isRequired,
};

function mapStateToProps(state) {
  return {
    ...getNavigator(state),
  };
}

export default connect(mapStateToProps)(Navigator);
//export default connect(mapStateToProps, dispatch => ({ dispatch }))(Navigator);

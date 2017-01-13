import React, { Component, PropTypes as Type } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import Editor from './Editor';
import Toolbar from './Toolbar';

import { elementContainsSelection } from '../../../../util/selection';
import { insertElementInTextNode, nodeTypeText, replaceNodeWith } from '../../../../util/domNode';
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
      if (nodeTypeText(window.getSelection().anchorNode)) {
        if (Navigator.hasCS) {
          this.updateCS();
        } else {
          this.initCS();
        }
      } else {
        console.error('ERROR trying to init custom select, anchorNode is not a text node'); // eslint-disable-line
        debugger; // eslint-disable-line
      }
    } else {
      console.error('ERROR trying to init custom select, anchorNode is not in navigator'); // eslint-disable-line
      debugger; // eslint-disable-line
    }
  }

  initCS() {
    const { anchorNode, anchorOffset } = window.getSelection();
    const defaultOffsets = getDefaultSelectionOffsets(anchorNode, anchorOffset);

    this.insertAnchorMarker(anchorNode, defaultOffsets[0]);

    const anchorMarkerEl = document.getElementById('c-s-a-m');
    const afterNode = anchorMarkerEl.nextSibling;

    this.insertFocusMarker(afterNode, defaultOffsets[1]);

    const focusMarkerEl = document.getElementById('c-s-f-m');
    const beforeNode = focusMarkerEl.previousSibling;

    this.insertStartBlock(beforeNode);

    Navigator.hasCS = true;
  }

  insertAnchorMarker(textNode, index) {
    const anchorMarker = '<span id="c-s-a-m"></span>';
    insertElementInTextNode(anchorMarker, textNode, index);
  }

  insertFocusMarker(textNode, index) {
    const focusMarker = '<span id="c-s-f-m"></span>';
    insertElementInTextNode(focusMarker, textNode, index);
  }

  insertStartBlock(textNode) {
    replaceNodeWith(textNode, `<span id='c-s-s-b'>${textNode.nodeValue}</span>`);
  }

  insertMiddleAnchorBlock(textNode) {
    replaceNodeWith(textNode, `<span id='c-s-m-a-b'>${textNode.nodeValue}</span>`);
  }

  insertMiddleFocusBlock(textNode) {
    replaceNodeWith(textNode, `<span id='c-s-m-f-b'>${textNode.nodeValue}</span>`);
  }

  updateCS() {
    const { anchorNode, anchorOffset } = window.getSelection();

    if (anchorNode.parentNode.id === 'c-s-s-b') {
      return this.destroyCS();
    } else {
      return this.expandCS(anchorNode, anchorOffset);
    }
  }

  destroyCS() {
    this.removeAnchorMarker();
    this.removeFocusMarker();
    this.removeStartBlock();
    Navigator.hasCS = false;
  }

  removeAnchorMarker() {
    const anchorMarkerEl = document.getElementById('c-s-a-m');
    anchorMarkerEl.parentNode.removeChild(anchorMarkerEl);
  }

  removeFocusMarker() {
    const focusMarkerEl = document.getElementById('c-s-f-m');
    focusMarkerEl.parentNode.removeChild(focusMarkerEl);
  }

  removeStartBlock() {
    const startBlockEl = document.getElementById('c-s-s-b');
    replaceNodeWith(startBlockEl, startBlockEl.innerHTML);
  }

  removeMiddleAnchorBlock() {
    const middleBlockEl = document.getElementById('c-s-m-a-b');
    if (!middleBlockEl) return;
    replaceNodeWith(middleBlockEl, middleBlockEl.innerHTML);
  }

  removeMiddleFocusBlock() {
    const middleBlockEl = document.getElementById('c-s-m-f-b');
    if (!middleBlockEl) return;
    replaceNodeWith(middleBlockEl, middleBlockEl.innerHTML);
  }

  expandCS(anchorNode, anchorOffset) {
    const tempMarker = '<span id="c-s-t-m"></span>';
    insertElementInTextNode(tempMarker, anchorNode, anchorOffset);

    let tempMarkerEl = document.getElementById('c-s-t-m');

    const content = this.refs.content.innerHTML;
    const startBlock = '<span id="c-s-s-b">';

    if (content.indexOf(tempMarker) < content.indexOf(startBlock)) {
      // move anchorMarker
      this.removeAnchorMarker();
      this.insertAnchorMarker(tempMarkerEl.nextSibling, 0);
      const anchorMarkerEl = document.getElementById('c-s-a-m');
      this.removeMiddleAnchorBlock();
      this.insertMiddleAnchorBlock(anchorMarkerEl.nextSibling);
    } else {
      // move focusMarker
      this.removeFocusMarker();
      this.insertFocusMarker(
        tempMarkerEl.previousSibling,
        tempMarkerEl.previousSibling.nodeValue.length
      );
      const focusMarkerEl = document.getElementById('c-s-f-m');
      this.removeMiddleFocusBlock();
      this.insertMiddleFocusBlock(focusMarkerEl.previousSibling);
    }

    tempMarkerEl = document.getElementById('c-s-t-m');
    tempMarkerEl.parentNode.removeChild(tempMarkerEl);
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

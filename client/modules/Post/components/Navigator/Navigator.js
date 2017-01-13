import React, { Component, PropTypes as Type } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import Editor from './Editor';
import Toolbar from './Toolbar';

import { elementContainsSelection, clearSelection } from '../../../../util/selection';
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
    let abort = false;
    const sel = window.getSelection();
    const containedSel = elementContainsSelection(this.refs.content, sel);

    if (!sel.isCollapsed) {
      // eslint-disable-next-line
      console.log('Selection is not collapsed');
      abort = true;
    }

    if (!containedSel) {
      // eslint-disable-next-line
      console.warn('Selection is not in navigator');
      abort = true;
    }

    if (!nodeTypeText(sel.anchorNode)) {
      // eslint-disable-next-line
      console.warn('AnchorNode is not a text node');
      abort = true;
    }

    if (abort) {
      if (Navigator.hasCS) {
        clearSelection();
      }
      // eslint-disable-next-line
      return console.log('Abort new custom selection');
    }

    if (Navigator.hasCS) {
      this.updateCS(sel);
    } else {
      this.initCS(sel);
    }

    clearSelection();
  }

  initCS(sel) {
    const { anchorNode, anchorOffset } = sel;
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

  updateCS(sel) {
    const { anchorNode, anchorOffset } = sel;

    if (anchorNode.parentNode.id === 'c-s-s-b') {
      return this.destroyCS();
    } else {
      return this.expandCS(anchorNode, anchorOffset);
    }
  }

  destroyCS() {
    this.removeAnchorMarker();
    this.removeMiddleAnchorBlock();
    this.removeStartBlock();
    this.removeMiddleFocusBlock();
    this.removeFocusMarker();
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
      this.removeMiddleAnchorBlock();
      const anchorMarkerEl = document.getElementById('c-s-a-m');
      this.insertMiddleAnchorBlock(anchorMarkerEl.nextSibling);
    } else {
      // move focusMarker
      this.removeFocusMarker();
      this.insertFocusMarker(
        tempMarkerEl.previousSibling,
        tempMarkerEl.previousSibling.nodeValue.length
      );
      this.removeMiddleFocusBlock();
      const focusMarkerEl = document.getElementById('c-s-f-m');
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

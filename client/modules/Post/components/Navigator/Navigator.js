import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import Editor from './Editor';
import Toolbar from './Toolbar';

import {
  nodeContainsNativeSelection,
  clearNativeSelection,
} from '../../../../util/nativeSelection';

import {
  getNextNode,
  findNearestTextNode,
  insertElementInTextNode,
  nodeTypeText,
  replaceNodeWith,
  getTextNode,
  getLastTextNode,
} from '../../../../util/domNode';

import { deltaToString } from '../../../../util/delta';

import {
  ANCHOR_MARKER,
  FOCUS_MARKER,
  TEMP_MARKER,
  convertSelection,
  mapSelectionAnchorToContent,
  mapSelectionFocusToContent,
  createSelectionRange,
  getStartSelectionOffsets,
} from './selection';

import { toggleMakeMode, saveSelection, deleteSelection } from '../../PostActions';
import { getNavigator } from '../../PostReducer';

import styles from './navigator.scss'; // eslint-disable-line

class Navigator extends Component {
  constructor() {
    super();
    this.handleContentClick = this.handleContentClick.bind(this);
  }

  componentWillReceiveProps({ path: nextPath, params: nextParams }) {
    const { path, makeMode } = this.props;
    if (nextPath.sid !== path.sid && makeMode && nextParams.sid !== 'blank') {
      this.props.toggleMakeMode();
    }
  }

  componentDidUpdate(prevProps) {
    const { path, selection } = this.props;
    if (prevProps.path.sid !== path.sid && selection) {
      this.setSelection(convertSelection(
        prevProps.path.content,
        selection,
        path.content
      ));
    }
    if (prevProps.selection && !selection) {
      this.removeVisibleSelection();
    }
  }

  componentWillUnmount() {
    if (this.props.selection) {
      this.deleteSelection();
    }
  }

  setSelection(sel) {
    const contentEl = this.refs.content;
    const anchor = mapSelectionAnchorToContent(contentEl, sel);
    const startOffsets = getStartSelectionOffsets(anchor.node, anchor.offset);

    this.insertAnchorMarker(anchor.node, startOffsets[0]);

    const anchorMarkerEl = document.getElementById('c-s-a-m');
    const afterNode = findNearestTextNode(anchorMarkerEl, 'forwards');

    this.insertFocusMarker(afterNode, startOffsets[1]);

    const focusMarkerEl = document.getElementById('c-s-f-m');
    const beforeNode = findNearestTextNode(focusMarkerEl, 'backwards');

    this.insertMiddleBlock(beforeNode);

    const focus = mapSelectionFocusToContent(contentEl, sel);
    this.modifySelection(focus.node, focus.offset);
  }

  getSelection() {
    const contentEl = this.refs.content;
    return createSelectionRange(contentEl);
  }

  newSelection(sel) {
    let { anchorNode, anchorOffset } = sel;

    const startOffsets = getStartSelectionOffsets(anchorNode, anchorOffset);

    this.insertAnchorMarker(anchorNode, startOffsets[0]);

    const anchorMarkerEl = document.getElementById('c-s-a-m');
    const afterNode = findNearestTextNode(anchorMarkerEl, 'forwards');

    this.insertFocusMarker(afterNode, startOffsets[1]);

    const focusMarkerEl = document.getElementById('c-s-f-m');
    const beforeNode = findNearestTextNode(focusMarkerEl, 'backwards');

    this.insertMiddleBlock(beforeNode);

    this.expandToDefaultSelection();
  }

  modifySelection(anchorNode, anchorOffset) {
    this.insertTempMarker(anchorNode, anchorOffset);

    const tempMarkerEl = document.getElementById('c-s-t-m');
    const contentEl = this.refs.content;
    const content = contentEl.innerHTML;

    if (content.indexOf(TEMP_MARKER) > content.indexOf(ANCHOR_MARKER)) {
      // move focusMarker
      this.removeFocusMarker();
      const closestTextNode = findNearestTextNode(tempMarkerEl, 'backwards');
      if (!contentEl.contains(closestTextNode)) {
        return this.deleteSelection();
      }
      this.insertFocusMarker(closestTextNode, closestTextNode.length);
    } else {
      // move anchorMarker
      this.removeAnchorMarker();
      const closestTextNode = findNearestTextNode(tempMarkerEl, 'forwards');
      this.insertAnchorMarker(closestTextNode, 0);
    }
    this.removeTempMarker();

    this.removeMiddleBlocks();
    this.insertMiddleBlocks();
    this.props.saveSelection(this.getSelection());
  }

  expandToDefaultSelection() {
    const lastTextNode = getLastTextNode(this.refs.content, node => {
      if (node.className === 'ql-cursor' ||
          node.parentNode.className === 'ql-cursor') {
        return true;
      }
    });
    this.modifySelection(lastTextNode, lastTextNode.length);
  }

  deleteSelection() {
    this.removeVisibleSelection();
    this.props.deleteSelection();
  }

  removeVisibleSelection() {
    this.removeTempMarker();
    this.removeAnchorMarker();
    this.removeFocusMarker();
    this.removeMiddleBlocks();
  }

  insertTempMarker(node, index) {
    insertElementInTextNode(TEMP_MARKER, node, index);
  }

  insertAnchorMarker(node, index) {
    insertElementInTextNode(ANCHOR_MARKER, node, index);
  }

  insertFocusMarker(node, index) {
    insertElementInTextNode(FOCUS_MARKER, node, index);
  }

  insertMiddleBlock(textNode) {
    replaceNodeWith(textNode, `<span class='c-s-m-b'>${textNode.nodeValue}</span>`);
  }

  insertMiddleBlocks() {
    let anchorMarker = document.getElementById('c-s-a-m');

    let node = getNextNode(anchorMarker);
    let focusMarkerReached = false;

    while (node) {
      if (node.className === 'c-s-m-b') {
        node = getNextNode(node);
      }

      if (node.id === 'c-s-f-m') {
        focusMarkerReached = true;
      }

      if (node === this.refs.content) {
        break;
      } else if (!this.refs.content.contains(node)) {
        break;
      }

      const parentNode = node.parentNode;
      let nextSibling = node.nextSibling;

      const filterFun = childNode => {
        if (childNode.className === 'c-s-m-b') {
          return true;
        }
        if (childNode.id === 'c-s-f-m') {
          focusMarkerReached = true;
          return true;
        }
      }

      let textNode = getTextNode(node, filterFun);

      while (textNode) {
        if (focusMarkerReached) break;

        this.insertMiddleBlock(textNode);

        if (nodeTypeText(node)) {
          // node and textNode are the same, which means node.nextSibling was
          // disconnected when node was replaced by a middle block.
          const middleBlocks = document.getElementsByClassName('c-s-m-b');
          nextSibling = middleBlocks[middleBlocks.length-1].nextSibling;
          break;
        }

        textNode = getTextNode(node, filterFun);
      }

      if (focusMarkerReached) break;

      anchorMarker = document.getElementById('c-s-a-m');

      if (nextSibling) {
        node = nextSibling;
      } else {
        node = getNextNode(parentNode);
      }
    }
  }

  removeAnchorMarker() {
    const anchorMarkerEl = document.getElementById('c-s-a-m');
    if (!anchorMarkerEl) return;
    anchorMarkerEl.parentNode.removeChild(anchorMarkerEl);
  }

  removeFocusMarker() {
    const focusMarkerEl = document.getElementById('c-s-f-m');
    if (!focusMarkerEl) return;
    focusMarkerEl.parentNode.removeChild(focusMarkerEl);
  }

  removeMiddleBlocks() {
    const middleBlockEls = document.getElementsByClassName('c-s-m-b');
    if (!middleBlockEls) return;
    while (middleBlockEls.length > 0) {
      replaceNodeWith(middleBlockEls[0], middleBlockEls[0].innerHTML);
    }
  }

  removeTempMarker() {
    const tempMarkerEl = document.getElementById('c-s-t-m');
    if (!tempMarkerEl) return;
    tempMarkerEl.parentNode.removeChild(tempMarkerEl);
  }

  handleContentClick() {
    let abort = false;
    const sel = window.getSelection();
    const containedSel = nodeContainsNativeSelection(this.refs.content, sel);

    if (!sel.isCollapsed) {
      // eslint-disable-next-line no-console
      console.log('Selection is not collapsed');
      abort = true;
    }

    if (!containedSel) {
      // eslint-disable-next-line no-console
      console.warn('Selection is not in navigator');
      abort = true;
    }

    if (!nodeTypeText(sel.anchorNode)) {
      // eslint-disable-next-line no-console
      console.warn('AnchorNode is not a text node');
      abort = true;
    }

    const qlCursorEl = document.getElementsByClassName('ql-cursor')[0];
    if (qlCursorEl && qlCursorEl.contains(sel.anchorNode)) {
      // eslint-disable-next-line no-console
      console.warn('AnchorNode is inside quill cursor');
      abort = true;
    }

    if (abort) {
      if (this.props.selection) {
        clearNativeSelection();
      }
      // eslint-disable-next-line
      return console.log('Abort new selection');
    }

    if (this.props.selection) {
      this.modifySelection(sel.anchorNode, sel.anchorOffset);
    } else {
      this.newSelection(sel);
    }

    clearNativeSelection();
  }

  render() {
    const { params, makeMode, path } = this.props;
    return (
      <div className={styles.container}>
        <Helmet title={deltaToString(this.props.path.content, 30)} />
        {makeMode &&
          <Editor params={params} />}
        {!makeMode &&
          <div className='ql-container'>
            <div
              id='navigator-content'
              ref='content'
              className='ql-editor'
              onClick={this.handleContentClick}
              dangerouslySetInnerHTML={{ __html: path.htmlContent }}
            />
          </div>}
        <Toolbar params={params} />
      </div>
    );
  }
}

Navigator.propTypes = {
  params: T.object.isRequired,
  path: T.object.isRequired,
  selection: T.oneOfType([T.bool, T.object]),
  makeMode: T.bool.isRequired,
  saveSelection: T.func.isRequired,
  deleteSelection: T.func.isRequired,
  toggleMakeMode: T.func.isRequired,
};

function mapStateToProps(state) {
  return {
    ...getNavigator(state),
  };
}

export default connect(
  mapStateToProps, {
    saveSelection,
    deleteSelection,
    toggleMakeMode,
  }
)(Navigator);

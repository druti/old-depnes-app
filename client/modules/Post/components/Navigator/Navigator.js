import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import Editor from './Editor';
import Toolbar from './Toolbar';

import { elementContainsSelection, clearSelection } from '../../../../util/selection';

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
  getDefaultSelectionOffsets,
} from './customSelect';

import { toggleCustomSelect } from '../../PostActions';
import { getNavigator } from '../../PostReducer';
import { getCurrentUser } from '../../../Auth/AuthReducer';

import styles from './styles.scss'; // eslint-disable-line

class Navigator extends Component {
  constructor() {
    super();
    this.handleContentClick = this.handleContentClick.bind(this);
    this.initCS = this.initCS.bind(this);
    this.updateCS = this.updateCS.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { path, customSelect } = this.props;
    if (prevProps.path.sid !== path.sid && customSelect) {
      //this.initCS();
    }
    if (prevProps.customSelect && !customSelect) {
      this.destroyCS();
    }
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
      if (this.props.customSelect) {
        clearSelection();
      }
      // eslint-disable-next-line
      return console.log('Abort new custom selection');
    }

    if (this.props.customSelect) {
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

    this.expandToDefaultSelection();

    this.props.dispatch(toggleCustomSelect());
  }

  insertAnchorMarker(node, index) {
    insertElementInTextNode(ANCHOR_MARKER, node, index);
  }

  insertFocusMarker(node, index) {
    insertElementInTextNode(FOCUS_MARKER, node, index);
  }

  insertStartBlock(textNode) {
    replaceNodeWith(textNode, `<span id='c-s-s-b'>${textNode.nodeValue}</span>`);
  }

  insertAnchorBlock(textNode) {
    replaceNodeWith(textNode, `<span id='c-s-a-b'>${textNode.nodeValue}</span>`);
  }

  insertFocusBlock(textNode) {
    replaceNodeWith(textNode, `<span id='c-s-f-b'>${textNode.nodeValue}</span>`);
  }

  insertMiddleBlock(textNode) {
    replaceNodeWith(textNode, `<span class='c-s-m-b'>${textNode.nodeValue}</span>`);
  }

  insertMiddleBlocks() {
    let anchorMarker = document.getElementById('c-s-a-m');
    let anchorBlock = document.getElementById('c-s-a-b');
    let startBlock = document.getElementById('c-s-s-b');
    let focusMarker = document.getElementById('c-s-f-m');

    if (anchorMarker.parentNode === focusMarker.parentNode) {
      return;
    }

    let node = anchorMarker.nextSibling;
    let focusMarkerReached = false;

    while (node) {
      if (node === anchorBlock || node === startBlock) {
        node = getNextNode(node);
      }

      if (node === this.refs.content) {
        break;
      } else if (!this.refs.content.contains(node)) {
        break;
      }

      const parentNode = node.parentNode;
      let nextSibling = node.nextSibling;
      const focusMarkerParent = node.contains(focusMarker);

      const filterFun = childNode => {
        if (childNode.className === 'c-s-m-b') {
          return true;
        }
        if (childNode.id === 'c-s-s-b') {
          return true;
        }
        if (childNode.id === 'c-s-f-b') {
          return true;
        }
      }

      let textNode = getTextNode(node, filterFun);

      while (textNode) {
        if (focusMarkerParent) {
          const bitmask = focusMarker.compareDocumentPosition(textNode);
          const textNodeIsAfterFocusMarker =
            bitmask === 4 || bitmask === 35 || bitmask === 37;
          // eslint-disable-next-line
          console.log(`Focus marker, text node comparison bitmask: ${bitmask}`);
          if (textNodeIsAfterFocusMarker) {
            focusMarkerReached = true;
            break;
          }
        }

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
      anchorBlock = document.getElementById('c-s-a-b');
      startBlock = document.getElementById('c-s-s-b');
      focusMarker = document.getElementById('c-s-f-m');

      if (nextSibling) {
        node = nextSibling;
      } else {
        node = getNextNode(parentNode);
      }
    }
  }

  updateCS(sel) {
    const { anchorNode, anchorOffset } = sel;

    if (anchorNode.parentNode.id === 'c-s-s-b') {
      this.props.dispatch(toggleCustomSelect());
    } else {
      this.modifyCS(anchorNode, anchorOffset);
    }
  }

  modifyCS(anchorNode, anchorOffset) {
    const tempMarker = '<span id="c-s-t-m"></span>';
    insertElementInTextNode(tempMarker, anchorNode, anchorOffset);

    let tempMarkerEl = document.getElementById('c-s-t-m');

    const content = this.refs.content.innerHTML;
    const startBlock = '<span id="c-s-s-b">';

    if (content.indexOf(tempMarker) < content.indexOf(startBlock)) {
      // move anchorMarker
      this.removeAnchorMarker();
      let textNode = tempMarkerEl.nextSibling;
      if (!textNode || !nodeTypeText(textNode)) {
        textNode = findNearestTextNode(tempMarkerEl, 'forwards');
        const startBlockEl = document.getElementById('c-s-s-b');
        if (startBlockEl.contains(textNode)) {
          this.removeTempMarker();
          return this.props.dispatch(toggleCustomSelect());
        }
      }
      this.insertAnchorMarker(textNode, 0);
      this.removeAnchorBlock();
      const anchorMarkerEl = document.getElementById('c-s-a-m');
      if (!anchorMarkerEl) {
        this.removeTempMarker();
        return this.props.dispatch(toggleCustomSelect());
      }
      this.insertAnchorBlock(anchorMarkerEl.nextSibling);
    } else {
      // move focusMarker
      this.removeFocusMarker();
      this.insertFocusMarker(
        tempMarkerEl.previousSibling,
        tempMarkerEl.previousSibling.nodeValue.length
      );
      this.removeFocusBlock();
      const focusMarkerEl = document.getElementById('c-s-f-m');
      if (!focusMarkerEl) {
        this.removeTempMarker();
        return this.props.dispatch(toggleCustomSelect());
      }
      this.insertFocusBlock(focusMarkerEl.previousSibling);
    }

    tempMarkerEl = document.getElementById('c-s-t-m');
    tempMarkerEl.parentNode.removeChild(tempMarkerEl);

    this.removeMiddleBlocks();
    this.insertMiddleBlocks();
  }

  expandToDefaultSelection() {
    const lastTextNode = getLastTextNode(this.refs.content);
    this.modifyCS(lastTextNode, lastTextNode.length);
  }

  destroyCS() {
    this.removeAnchorMarker();
    this.removeAnchorBlock();
    this.removeStartBlock();
    this.removeFocusBlock();
    this.removeFocusMarker();
    this.removeMiddleBlocks();
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

  removeAnchorBlock() {
    const anchorBlockEl = document.getElementById('c-s-a-b');
    if (!anchorBlockEl) return;
    replaceNodeWith(anchorBlockEl, anchorBlockEl.innerHTML);
  }

  removeStartBlock() {
    const startBlockEl = document.getElementById('c-s-s-b');
    if (!startBlockEl) return;
    replaceNodeWith(startBlockEl, startBlockEl.innerHTML);
  }

  removeMiddleBlocks() {
    const middleBlockEls = document.getElementsByClassName('c-s-m-b');
    if (!middleBlockEls) return;
    while (middleBlockEls.length > 0) {
      replaceNodeWith(middleBlockEls[0], middleBlockEls[0].innerHTML);
    }
  }

  removeFocusBlock() {
    const focusBlockEl = document.getElementById('c-s-f-b');
    if (!focusBlockEl) return;
    replaceNodeWith(focusBlockEl, focusBlockEl.innerHTML);
  }
  removeTempMarker() {
    const tempMarkerEl = document.getElementById('c-s-t-m');
    if (!tempMarkerEl) return;
    tempMarkerEl.parentNode.removeChild(tempMarkerEl);
  }

  render() {
    const { user, params, makeMode, path } = this.props;
    return (
      <div className={styles.container}>
        <Helmet title={deltaToString(this.props.path.content, 30)} />
        {makeMode &&
          <Editor
            user={user}
            params={params}
            path={path}
          />}
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
        <Toolbar
          user={user}
          params={params}
        />
      </div>
    );
  }
}

Navigator.propTypes = {
  user: T.object,
  params: T.object.isRequired,
  path: T.object.isRequired,
  customSelect: T.bool.isRequired,
  makeMode: T.bool.isRequired,
  dispatch: T.func.isRequired,
};

function mapStateToProps(state) {
  return {
    ...getNavigator(state),
    user: getCurrentUser(state),
  };
}

export default connect(mapStateToProps, dispatch => ({ dispatch }))(Navigator);

import React, { Component, PropTypes as Type } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import Editor from './Editor';
import Toolbar from './Toolbar';

import { elementContainsSelection, clearSelection } from '../../../../util/selection';

import {
  insertElementInTextNode,
  nodeTypeText,
  replaceNodeWith,
  getTextNodesInNode,
} from '../../../../util/domNode';

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
    const anchorMarker = document.getElementById('c-s-a-m');
    const anchorBlock = document.getElementById('c-s-a-b');
    const startBlock = document.getElementById('c-s-s-b');
    const focusBlock = document.getElementById('c-s-f-b');
    const focusMarker = document.getElementById('c-s-f-m');

    if (anchorMarker.parentNode === focusMarker.parentNode) {
      return;
    }

    let node = anchorMarker.nextSibling;

    while (node) {
      if (node === anchorBlock || node === startBlock) {
        if (node.nextSibling) {
          node = node.nextSibling;
        }
        else if (node.parentNode === this.refs.content) {
          break;
        } else {
          node = node.parentNode.nextSibling;
        }
      }

      let textNodes = getTextNodesInNode(node);

      if (node.contains(focusMarker)) {
        const filteredTextNodes = [];
        for (let i = 0; i < textNodes.length; i++) {
          const tN = textNodes[i];
          const startBlockCon = startBlock.contains(tN);
          const focusBlockCon = focusBlock ? focusBlock.contains(tN) : false;
          if (startBlockCon || focusBlockCon) {
            break;
          }
          filteredTextNodes.push(tN);
        }
        filteredTextNodes.forEach(this.insertMiddleBlock);
        break;
      } else {
        const parentNode = node.parentNode;
        const nextSibling = node.nextSibling;

        textNodes.forEach(this.insertMiddleBlock);

        if (nextSibling) {
          node = nextSibling;
        }
        else if (parentNode === this.refs.content) {
          break;
        } else {
          node = parentNode.nextSibling;
        }
      }
    }
  }

  updateCS(sel) {
    const { anchorNode, anchorOffset } = sel;

    if (anchorNode.parentNode.id === 'c-s-s-b') {
      return this.destroyCS();
    } else {
      return this.modifyCS(anchorNode, anchorOffset);
    }
  }

  destroyCS() {
    this.removeAnchorMarker();
    this.removeAnchorBlock();
    this.removeStartBlock();
    this.removeFocusBlock();
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

  removeAnchorBlock() {
    const anchorBlockEl = document.getElementById('c-s-a-b');
    if (!anchorBlockEl) return;
    replaceNodeWith(anchorBlockEl, anchorBlockEl.innerHTML);
  }

  removeStartBlock() {
    const startBlockEl = document.getElementById('c-s-s-b');
    replaceNodeWith(startBlockEl, startBlockEl.innerHTML);
  }

  removeMiddleBlocks() {
    const middleBlockEls = document.getElementsByClassName('c-s-m-b');
    if (!middleBlockEls) return;
    for (let i = 0; i < middleBlockEls.length; i++) {
      const el = middleBlockEls[i];
      replaceNodeWith(el, el.innerHTML);
    }
  }

  removeFocusBlock() {
    const focusBlockEl = document.getElementById('c-s-f-b');
    if (!focusBlockEl) return;
    replaceNodeWith(focusBlockEl, focusBlockEl.innerHTML);
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
      this.insertAnchorMarker(tempMarkerEl.nextSibling, 0);
      this.removeAnchorBlock();
      const anchorMarkerEl = document.getElementById('c-s-a-m');
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
      this.insertFocusBlock(focusMarkerEl.previousSibling);
    }

    tempMarkerEl = document.getElementById('c-s-t-m');
    tempMarkerEl.parentNode.removeChild(tempMarkerEl);

    this.removeMiddleBlocks();
    this.insertMiddleBlocks();
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

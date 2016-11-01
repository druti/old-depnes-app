import React, { PropTypes } from 'react';
import $ from 'jquery';
import EventEmitter from 'events';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

import Editor from './Editor';
import Toolbar from './Toolbar';

// Import Actions
import { addPostRequest, fetchPosts } from '../../PostActions';

// Import Selectors
import { getPosts } from '../../PostReducer';

const navigatorEmitter = new EventEmitter();

class Navigator extends React.Component {
  constructor(props) {
    super(props);

    const path = this.props.path;
    const editorContent = path ? path.content : {};
    const editorHtmlContent = path ? path.htmlContent : '';
    const editorTextContent = path ? path.textContent : '';

    this.state = {
      editorContent,
      editorHtmlContent,
      editorTextContent,
      editMode: false,
      toolbarOpen: false,
    };

    this.onNavigatorViewClick = this.onNavigatorViewClick.bind(this);
    this.toggleEditMode = this.toggleEditMode.bind(this);
    this.nextPath = this.nextPath.bind(this);
    this.closeNavigatorToolbar = this.closeNavigatorToolbar.bind(this);
    this.openNavigatorToolbar = this.openNavigatorToolbar.bind(this);
    this.onEditorChange = this.onEditorChange.bind(this);
  }

  componentWillMount() {
    this.props.dispatch(fetchPosts());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.path && nextProps.path.cuid !== this.props.path.cuid) {
      const {
        content: editorContent,
        htmlContent: editorHtmlContent,
        textContent: editorTextContent,
      } = nextProps.path;
      this.setState({ editorContent, editorHtmlContent, editorTextContent });
    }
  }

  onNavigatorViewClick() {
    if (!this.state.toolbarOpen) {
      this.setState({ toolbarOpen: true });
    }

    placeCursor();
  }

  toggleEditMode() { // eslint-disable-line
    const previousEditModeState = this.state.editMode;
    const editMode = !previousEditModeState;

    if (previousEditModeState) {
      const { htmlContent: pathHtmlContent } = this.props.path;
      const { editorContent, editorHtmlContent, editorTextContent } = this.state;

      if (editorHtmlContent !== pathHtmlContent && editorTextContent.length) {
        const createPathAction = addPostRequest({
          editorContent,
          editorHtmlContent,
          editorTextContent,
        });
        const newPathId = createPathAction.cuid;

        const result = createPathAction(this.props.dispatch);
        debugger;
        result.then(res => {
          debugger;
          browserHistory.push(`/paths/${newPathId}`);
        });
      }
    }

    this.setState({ editMode });
  }

  nextPath() {
    const currentPath = this.props.path;
    const paths = this.props.paths;
    let selection = getSelection();

    if (explorerContainsSelection(selection)) {
      selection = forceProperSelection(selection);
      goToNextMatchedPath(currentPath, paths, selection);
    }
    else {
      goToNextConsecutivePath(paths, currentPath);
    }
  }

  openNavigatorToolbar() {
    this.setState({ toolbarOpen: true });
  }

  closeNavigatorToolbar() {
    this.setState({ toolbarOpen: false });
    $('#cursor').remove();
  }

  onEditorChange(delta, editor) {
    this.setState({
      editorContent: delta,
      editorHtmlContent: editor.root.innerHTML,
      editorTextContent: editor.getText(),
    });
  }

  componentDidUpdate() {
    navigatorEmitter.emit('componentDidUpdate');
  }

  render() {
    const {
      editMode,
      toolbarOpen,
      editorContent,
      editorHtmlContent,
      editorTextContent,
    } = this.state;

    let View;

    if (editMode) {
      View = (
        <Editor
          content={editorContent}
          htmlContent={editorHtmlContent}
          textContent={editorTextContent}
          onChange={this.onEditorChange}
        />
      );
    } else {
      View = (
        <div
          id='navigator-view'
          onClick={this.onNavigatorViewClick}
          dangerouslySetInnerHTML={{__html: editorHtmlContent}}
        />
      );
    }

    return (
      <div className={this.props.className}>
        {View}
        <Toolbar
          isOpen={toolbarOpen}
          isEditMode={editMode}
          open={this.openNavigatorToolbar}
          toggleEditMode={this.toggleEditMode}
          nextPath={this.nextPath}
          close={this.closeNavigatorToolbar}
        />
      </div>
    );
  }
}

Navigator.propTypes = {
  dispatch: PropTypes.func.isRequired,
  path: PropTypes.object,
  paths: PropTypes.array,
  className: PropTypes.string,
};


function placeCursor() {
  const sel = getSelection();

  if (sel.isCollapsed && sel.anchorNode.nodeValue) {
    $('#cursor').remove();

    const newTextNodes = insertElementInTextNode(
      sel.anchorNode,
      sel.anchorOffset,
      '<span id="cursor"></span>',
    );

    const beforeNode = newTextNodes[0];

    createNewSelection(
      beforeNode,
      beforeNode.nodeValue.length,
      beforeNode,
      beforeNode.nodeValue.length,
    );
  } else {
    $('#cursor').remove();
  }
}


function explorerContainsSelection(selection) {
  const explorer = $('#navigator-view')[0];
  const anchorNode = selection.anchorNode;
  const focusNode = selection.focusNode;

  if (explorer.contains(anchorNode) &&
      explorer.contains(focusNode) &&
      explorer !== anchorNode &&
      explorer !== focusNode
    ) {
    return true;
  } else {
    return false;
  }
}


function forceProperSelection(selection) {
  // eslint-disable-next-line no-param-reassign
  selection = invertBackwardSelection(selection);

  let { anchorNode, focusNode, anchorOffset, focusOffset } = selection;
  const originalAnchorNode = anchorNode;
  const originalFocusNode = focusNode;

  // normalize selection
  anchorNode = findNearestTextNode(anchorNode, 'forwards');
  if (originalAnchorNode.nodeType !== 3) {
    anchorOffset = 0;
  }

  if (anchorOffset === 0) {
    // move selection to next valid node since text is selected from the start
    anchorNode = findNextTextNodeOrBlock(anchorNode, 'backwards');
    anchorOffset = anchorNode.nodeValue ? anchorNode.nodeValue.length : 0;
  }

  // normalize selection
  focusNode = findNearestTextNode(focusNode, 'backwards');
  if (originalFocusNode.nodeType !== 3) {
    focusOffset = focusNode.nodeValue.length;
  }

  if (focusNode.nodeValue && focusOffset === focusNode.nodeValue.length) {
    // move selection to next valid node since text is selected till the end
    focusNode = findNextTextNodeOrBlock(focusNode, 'forwards');
    focusOffset = 0;
  }

  return {
    anchorNode,
    anchorOffset,
    focusNode,
    focusOffset,
  };
}


function invertBackwardSelection(sel) {
  let position = sel.anchorNode.compareDocumentPosition(sel.focusNode);
  let backward = false;
  const selection = {
    anchorNode: sel.anchorNode,
    anchorOffset: sel.anchorOffset,
    focusNode: sel.focusNode,
    focusOffset: sel.focusOffset,
  };

  if (position === 0 && sel.anchorOffset > sel.focusOffset ||
      position === Node.DOCUMENT_POSITION_PRECEDING
    ) {
      backward = true;
  }

  if (backward) {
    selection.anchorNode = sel.focusNode;
    selection.anchorOffset = sel.focusOffset;
    selection.focusNode = sel.anchorNode;
    selection.focusOffset = sel.anchorOffset;
  }

  return selection;
}


function findNearestTextNode(node, direction) {
  if (node.nodeType === 3) {
    return node;
  }

  const forwards = direction !== 'backwards';
  const sibling = forwards ? node.nextSibling : node.previousSibling;
  const siblingTextNodes = getTextNodesInNode(sibling);

  if (siblingTextNodes.length) {
    return forwards ?
      siblingTextNodes[0] :
      siblingTextNodes[siblingTextNodes.length - 1];
  } else {
    const nextNode = sibling ? sibling : node.parentNode;
    return findNearestTextNode(nextNode, direction);
  }
}


function findNextTextNodeOrBlock(node, direction) {
  if (node.nodeName === 'P' ||
      node.nodeName === 'UL' ||
      node.nodeName === 'OL'
    ) {
    return node;
  }

  const forwards = direction !== 'backwards';
  const sibling = forwards ? node.nextSibling : node.previousSibling;
  const siblingTextNodes = getTextNodesInNode(sibling);

  if (siblingTextNodes.length) {
    return forwards ?
      siblingTextNodes[0] :
      siblingTextNodes[siblingTextNodes.length - 1];
  } else {
    const nextNode = sibling ? sibling : node.parentNode;
    return findNextTextNodeOrBlock(nextNode, direction);
  }
}


function getTextNodesInNode(n) {
  const textNodes = [];

  function getTextNodes(node) {
    if (node.nodeType === 3) {
      textNodes.push(node);
    } else {
      const childNodes = node.childNodes;

      for (let i = 0; i < childNodes.length; i++) {
        getTextNodes(childNodes[i]);
      }
    }
  }

  if (n) {
    getTextNodes(n);
  }

  return textNodes;
}


function goToNextMatchedPath(currentPath, paths, selection) {
  let anchorNode = selection.anchorNode;
  let focusNode = selection.focusNode;
  let anchorOffset = selection.anchorOffset;
  let focusOffset = selection.focusOffset;
  let recreateSelection;

  if (anchorNode === focusNode) {
    recreateSelection = true;
  }

  if (anchorNode.nodeType === 3) {
    const newTextNodes = insertElementInTextNode(
      anchorNode,
      anchorOffset,
      '<span id="__selectionAnchorOffset"></span>',
    );

    if (recreateSelection) {
      focusNode = newTextNodes[1];
      focusOffset = focusOffset - anchorOffset;
    }

    anchorNode = newTextNodes[0];
    anchorOffset = anchorNode.nodeValue.length;

    // eslint-disable-next-line no-param-reassign
    selection = {
      anchorNode,
      anchorOffset,
      focusNode,
      focusOffset,
    };
  } else {
    $(anchorNode).before('<span id="__selectionAnchorOffset"></span>');
  }

  if (focusNode.nodeType === 3) {
    const newTextNodes = insertElementInTextNode(
      focusNode,
      focusOffset,
      '<span id="__selectionFocusOffset"></span>',
    );

    focusNode = newTextNodes[1];
    focusOffset = 0;

    // eslint-disable-next-line no-param-reassign
    selection = {
      anchorNode,
      anchorOffset,
      focusNode,
      focusOffset,
    };
  } else {
    $(focusNode).after('<span id="__selectionFocusOffset"></span>');
  }

  $('#cursor').remove();

  const navigatorHTML = $('#navigator-view').html();
  const splitNavigatorHTML = navigatorHTML.split('<span id="__selectionAnchorOffset"></span>');

  let startHTML = splitNavigatorHTML[0];
  let endHTML = splitNavigatorHTML[1].split('<span id="__selectionFocusOffset"></span>')[1];

  const startOffset = startHTML.length;

  const nextPath = getNextPath(currentPath, paths, startHTML, endHTML);

  if (!nextPath) {
    $('#__selectionAnchorOffset, #__selectionFocusOffset').remove();

    const originalSelection = invertBackwardSelection(getSelection());

    createNewSelection(
      anchorNode.nodeType === 3 ? anchorNode : originalSelection.anchorNode,
      anchorNode.nodeType === 3 ? anchorOffset : originalSelection.anchorOffset,
      focusNode.nodeType === 3 ? focusNode : originalSelection.focusNode,
      focusNode.nodeType === 3 ? focusOffset : originalSelection.focusOffset,
    );

    placeCursor();

    // eslint-disable-next-line no-console
    return console.warn('No match found.');
  }

  browserHistory.push(`/paths/${nextPath.cuid}`);

  const nextEndOffset = nextPath.htmlContent.length - endHTML.length;

  // the start offset and anchor offset should not have changed as the htmlContent
  // before the selection is the same.
  navigatorEmitter.once('componentDidUpdate', () => {
    setSelection(startOffset, nextEndOffset);
    placeCursor();
  });
}


function getNextPath(currentPath, paths, startHTML, endHTML) {
  let nextMatch;
  const currentPathIndex = paths.indexOf(currentPath)

  // Reorder paths, excluding current path and starting at next path
  // eslint-disable-next-line no-param-reassign
  paths = paths.slice(currentPathIndex + 1).concat(paths.slice(0, currentPathIndex));

  for (let i = 0; i < paths.length; i++) {
    let path = paths[i];

    let startsWith = path.htmlContent.startsWith(startHTML);
    let endsWith = path.htmlContent.endsWith(endHTML);

    if (startsWith && endsWith) {
      nextMatch = path;
      break;
    }
  }

  return nextMatch;
}


function setSelection(startOffset, endOffset) {
  const navigatorNodes = $('#navigator-view').children();

  const startNodeAndOffset = getStartNode(navigatorNodes, startOffset);
  const anchorNode = startNodeAndOffset[0];
  const anchorOffset = startNodeAndOffset[1];

  const endNodeAndOffset = getEndNode(navigatorNodes, endOffset);
  const focusNode = endNodeAndOffset[0];
  let focusOffset = endNodeAndOffset[1];

  // caused by overlapping startHTML and endHTML and a collapsed selection
  if (anchorNode === focusNode && anchorOffset > focusOffset) {
    // start offset precedence
    focusOffset = anchorOffset;
  }

  createNewSelection(
    anchorNode,
    anchorOffset,
    focusNode,
    focusOffset,
  );
}


function getStartNode(navigatorNodes, startOffset) {
  let startNode;
  let anchorOffset;
  let comparisonStartOffset = 0;
  let offsetTillStartNode = 0;

  function iterateNodesAndCount(nodes) {
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      let nodeName = node.nodeName;

      offsetTillStartNode = comparisonStartOffset;

      comparisonStartOffset += node.nodeValue ? node.nodeValue.length : 0;

      if (comparisonStartOffset >= startOffset) {
        startNode = node;
        anchorOffset = startOffset - offsetTillStartNode;
        anchorOffset = anchorOffset < 0 ? 0 : anchorOffset;
        break;
      }

      if (node.nodeType === 1) {
        comparisonStartOffset += `<${nodeName}>`.length;
        if (node.style.cssText) {
          comparisonStartOffset += ` style="${node.style.cssText}"`.length;
        }
        if (node.href) {
          comparisonStartOffset += ` href="${node.attributes['href'].value}"`.length;
        }
        if (node.src) {
          comparisonStartOffset += ` src="${node.attributes['src'].value}"`.length;
        }
        iterateNodesAndCount(node.childNodes);
        if (startNode) {
          break;
        }
        if (nodeName !== 'BR' && nodeName !== 'IMG') {
          comparisonStartOffset += `</${nodeName}>`.length;
        }
      }
    }
  }

  navigatorNodes.each(function (index, node) {
    let nodeName = node.nodeName;

    if (comparisonStartOffset >= startOffset) {
      startNode = node;
    } else {
      comparisonStartOffset += `<${nodeName}>`.length;
      if (node.style.cssText) {
        comparisonStartOffset += ` style="${node.style.cssText}"`.length;
      }
      iterateNodesAndCount(node.childNodes);
      comparisonStartOffset += `</${nodeName}>`.length;
    }

    if (!startNode) {
      return true;
    } else {
      return false;
    }
  });

  return [startNode, anchorOffset];
}


function getEndNode(navigatorNodes, endOffset) {
  let endNode;
  let focusOffset;
  let comparisonEndOffset = 0;
  let offsetTillEndNode = 0;

  function iterateNodesAndCount(nodes) {
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      let nodeName = node.nodeName;

      if (node.nodeType === 1) {
        comparisonEndOffset += `<${nodeName}>`.length;
        if (node.style.cssText) {
          comparisonEndOffset += ` style="${node.style.cssText}"`.length;
        }
        if (node.href) {
          comparisonEndOffset += ` href="${node.attributes['href'].value}"`.length;
        }
        if (node.src) {
          comparisonEndOffset += ` src="${node.attributes['src'].value}"`.length;
        }
        iterateNodesAndCount(node.childNodes);
        if (endNode) {
          break;
        }
        if (nodeName !== 'BR' && nodeName !== 'IMG') {
          comparisonEndOffset += `</${nodeName}>`.length;
        }
      }

      offsetTillEndNode = comparisonEndOffset;

      comparisonEndOffset += node.nodeValue ? node.nodeValue.length : 0;

      if (comparisonEndOffset >= endOffset) {
        endNode = node;

        focusOffset = endOffset - offsetTillEndNode;
        focusOffset = focusOffset < 0 ? 0 : focusOffset;
        break;
      }
    }
  }

  navigatorNodes.each(function (index, node) {
    let nodeName = node.nodeName;

    if (comparisonEndOffset >= endOffset) {
      endNode = node;
    } else {
      comparisonEndOffset += `<${nodeName}>`.length;
      if (node.style.cssText) {
        comparisonEndOffset += ` style="${node.style.cssText}"`.length;
      }
      iterateNodesAndCount(node.childNodes);
      comparisonEndOffset += `</${nodeName}>`.length;
    }

    if (!endNode) {
      return true;
    } else {
      return false;
    }
  });

  return [endNode, focusOffset];
}


function insertElementInTextNode(textNode, index, elStr) {
  const nodeValue = textNode.nodeValue;

  if (typeof nodeValue === 'string') {
    const beforeText = nodeValue.slice(0, index);
    const afterText = nodeValue.slice(index);
    const beforeNode = document.createTextNode(beforeText);
    const afterNode = document.createTextNode(afterText);

    $(textNode).replaceWith([
      beforeNode,
      elStr,
      afterNode,
    ]);

    return [beforeNode, afterNode];
  }
}

function createNewSelection(startNode, startOffset, endNode, endOffset) {
  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);
  const newSelection = window.getSelection();
  newSelection.removeAllRanges();
  newSelection.addRange(range);
  return newSelection;
}

function goToNextConsecutivePath(paths, currentPath) {
  let nextPath;
  let nextPathId;
  for (let i = 0; i < paths.length; i++) {
    if (paths[i].cuid === currentPath.cuid) {
      nextPath = paths[i + 1];
      nextPathId = nextPath ? nextPath.cuid : paths[0].cuid;
    }
  }

  createNewSelection(
    $('#navigator-view')[0],
    0,
    $('#navigator-view')[0],
    0,
  );

  browserHistory.push(`/paths/${nextPathId}`);
}

// Retrieve data from store as props
function mapStateToProps(state, props) {
  return {
    paths: getPosts(state, props.path.cuid),
  };
}

export default connect(mapStateToProps, dispatch => ({ dispatch }))(Navigator);

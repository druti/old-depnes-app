import React, { Component, PropTypes } from 'react';
import {AppBar as ToolboxAppBar} from 'react-toolbox/lib/app_bar';
import {Button, IconButton} from 'react-toolbox/lib/button';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import sanitizeHtml from 'sanitize-html';
import { Scrollbars } from 'react-custom-scrollbars';

import { updateNavigator, toggleMakeMode, addPostRequest } from '../../PostActions';

// Import Selectors
import { getNavigator, getPost, getPosts } from '../../PostReducer';

import styles from './styles.scss'; // eslint-disable-line

import { navigatorEmitter } from './Navigator';

class AppBar extends Component {
  constructor() {
    super();
    this.state = {};
    this.nextPath = this.nextPath.bind(this);
    this.toggleMakeMode = this.toggleMakeMode.bind(this);
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

  toggleMakeMode() { // eslint-disable-line
    const previousMakeModeState = this.props.makeMode;

    const {
      content: pathContent,
      htmlContent: pathHtmlContent,
      textContent: pathTextContent,
    } = this.props.path;

    if (previousMakeModeState) {
      let { content, htmlContent, textContent } = this.props;

      const sanitationOptions = {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'span' ]),
        allowedAttributes: Object.assign(
          sanitizeHtml.defaults.allowedAttributes,
          { span: [ 'id' ] }
        ),
      };
      htmlContent = sanitizeHtml(htmlContent, sanitationOptions);

      if (JSON.stringify(content) !== JSON.stringify(pathContent) && textContent.length) {
        const result = this.props.dispatch(addPostRequest({
          content,
          htmlContent,
          textContent,
        }));

        result.then(res => {
          browserHistory.push(`/paths/${res.post.cuid}`);
        });
      }

      this.props.dispatch(toggleMakeMode());
    } else {
      this.props.dispatch(updateNavigator({
        makeMode: !previousMakeModeState,
        content: pathContent,
        htmlContent: pathHtmlContent,
        textContent: pathTextContent,
      }));
    }
  }

  render() {
    const { auth, theme, toggleDrawer, signUp, logIn, makeMode } = this.props;
    return (
      <ToolboxAppBar theme={theme}>
        <Scrollbars className={styles.navigatorAppBarContainer} id='navigator-toolbar'>
          <div className={styles.navigatorAppBar}>
            <IconButton icon='menu' inverse onClick={toggleDrawer}/>
            {!makeMode &&
              <Button
                accent
                label='Read'
                onClick={this.nextPath}
              />
            }
            <Button
              accent
              raised={makeMode}
              label={makeMode ? ' Save' : ' Write'}
              onClick={auth.loggedIn() ? this.toggleMakeMode : signUp}
            />
            {makeMode &&
              <div id='navigator-editor-toolbar' className={styles.editorToolbar}>

                <IconButton
                  inverse
                  className='ql-authors'
                ><i className='fa fa-user'/></IconButton>
                <IconButton
                  inverse
                  className='ql-bold'
                ><i className='fa fa-bold'/></IconButton>
                <IconButton
                  inverse
                  className='ql-italic'
                ><i className='fa fa-italic'/></IconButton>
                <IconButton
                  inverse
                  className='ql-underline'
                ><i className='fa fa-underline'/></IconButton>
                <IconButton
                  inverse
                  className='ql-strike'
                ><i className='fa fa-strikethrough'/></IconButton>
                <span className={styles.separator}/>

                <IconButton
                  inverse
                  className='ql-size'
                  value='large'
                ><i className='fa fa-header'/></IconButton>
                <span className={styles.separator}/>


                <IconButton
                  inverse
                  className='ql-list'
                  value='ordered'
                ><i className='fa fa-list-ol'/></IconButton>
                <IconButton
                  inverse
                  className='ql-list'
                  value='bullet'
                ><i className='fa fa-list-ul'/></IconButton>
                <span className={styles.separator}/>


                <IconButton
                  inverse
                  className='ql-align'
                  value='center'
                ><i className='fa fa-align-center'/></IconButton>
                <IconButton
                  inverse
                  className='ql-align'
                  value='right'
                ><i className='fa fa-align-right'/></IconButton>
                <IconButton
                  inverse
                  className='ql-align'
                  value='justify'
                ><i className='fa fa-align-justify'/></IconButton>
                <span className={styles.separator}/>


                <IconButton
                  inverse
                  className='ql-link'
                ><i className='fa fa-link'/></IconButton>
                <IconButton
                  inverse
                  className='ql-image'
                ><i className='fa fa-image'/></IconButton>
                <IconButton
                  inverse
                  className='ql-video'
                ><i className='fa fa-film'/></IconButton>

              </div>
            }
            {auth.loggedIn() &&
              <Button
                accent
                label='Profile'
                onClick={() => /*eslint-disable*/console.log(auth.getProfile())/*eslint-enable*/ }
              />
            }
            {!auth.loggedIn() &&
              <Button label='Log In' onClick={logIn} accent />
            }
            {!auth.loggedIn() &&
              <Button label='Sign Up' onClick={signUp} raised accent />
            }
          </div>
        </Scrollbars>
      </ToolboxAppBar>
    );
  }
}

AppBar.propTypes = {
  auth: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  logIn: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  makeMode: PropTypes.bool.isRequired,
  content: PropTypes.object,
  htmlContent: PropTypes.string,
  textContent: PropTypes.string,
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
  /*
  if (anchorNode === originalAnchorNode) { // node was already a text node
    const contentBeforeAnchor = anchorNode.textContent.substring(0, anchorOffset);
    if (!contentBeforeAnchor.trim()) {
      anchorOffset = 0;
    }
  }
  */
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
  /*
  if (focusNode === originalFocusNode) { // node was already a text node
    const contentAfterFocus = focusNode.textContent.substring(anchorOffset);
    if (!contentAfterFocus.trim()) {
      focusOffset = 0;
    }
  }
  */
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

  if (siblingTextNodes.length && (
      siblingTextNodes[0].textContent.length ||
      siblingTextNodes[siblingTextNodes.length - 1].textContent.length
    )) {
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

  if (siblingTextNodes.length && (
      siblingTextNodes[0].textContent.length ||
      siblingTextNodes[siblingTextNodes.length - 1].textContent.length
    )) {
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

  let navigatorHTML = $('#navigator-view').html();

  // Sanitize since HTML coming from DB has been sanitized.
  const sanitationOptions = {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img', 'span' ]),
    allowedAttributes: Object.assign(
      sanitizeHtml.defaults.allowedAttributes,
      { span: [ 'id' ] }
    ),
  };
  navigatorHTML = sanitizeHtml(navigatorHTML, sanitationOptions);

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
        if (nodeName === 'BR' || nodeName === 'IMG') {
          comparisonStartOffset += `<${nodeName} />`.length;
        } else {
          comparisonStartOffset += `<${nodeName}>`.length;
        }
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
      if (nodeName === 'BR' || nodeName === 'IMG') {
        comparisonStartOffset += `<${nodeName} />`.length;
      } else {
        comparisonStartOffset += `<${nodeName}>`.length;
      }
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
        if (nodeName === 'BR' || nodeName === 'IMG') {
          comparisonEndOffset += `<${nodeName} />`.length;
        } else {
          comparisonEndOffset += `<${nodeName}>`.length;
        }
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
      if (nodeName === 'BR' || nodeName === 'IMG') {
        comparisonEndOffset += `<${nodeName} />`.length;
      } else {
        comparisonEndOffset += `<${nodeName}>`.length;
      }
      if (node.style.cssText) {
        comparisonEndOffset += ` style="${node.style.cssText}"`.length;
      }
      iterateNodesAndCount(node.childNodes);
      comparisonEndOffset += `</${nodeName}>`.length;
    }

    if (!endNode) {
      if (index === navigatorNodes.length - 1) { // if it's the last node
        const lastNode = node;
        const textNodes = getTextNodesInNode(lastNode);
        if (textNodes) {
          endNode = textNodes[textNodes.length - 1];
          focusOffset = endNode.nodeValue.length;
        }
      }
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
  if (!startNode || !endNode) {
    return;
  }
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

function mapStateToProps(state, props) {
  return {
    ...getNavigator(state),
    path: getPost(state, props.params.cuid),
    paths: getPosts(state),
  };
}

export default connect(mapStateToProps, dispatch => ({ dispatch }))(AppBar);

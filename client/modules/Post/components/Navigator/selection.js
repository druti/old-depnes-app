import { deltaToString } from '../../../../util/delta';
import { getTextNodesInNode, nodeTypeText } from '../../../../util/domNode';

export const ANCHOR_MARKER = '<span id="c-s-a-m"></span>';
export const FOCUS_MARKER = '<span id="c-s-f-m"></span>';
export const TEMP_MARKER = '<span id="c-s-t-m"></span>';

export function convertSelection(content, sel, newContent) {
  const contentString = deltaToString(content);
  const newContentString = deltaToString(newContent);
  const endString = contentString.slice(sel.index + sel.length);
  return {
    index: sel.index,
    length: newContentString.lastIndexOf(endString) - sel.index,
  };
}

export function mapSelectionAnchorToContent(navigatorContentEl, sel) {
  let anchorNode;
  let anchorOffset;
  let counter = 0;
  getTextNodesInNode(navigatorContentEl, node => {
    if (nodeTypeText(node)) {
      counter += node.length;
      if (counter >= sel.index) {
        anchorNode = node;
        anchorOffset = sel.index - (counter - node.length);
        return true; // stop looking for text nodes
      }
    } else if (node.tagName === 'BR') {
      counter += 2;
    }
  });

  return { node: anchorNode, offset: anchorOffset };
}

export function mapSelectionFocusToContent(navigatorContentEl, sel) {
  const focusIndex = sel.index + sel.length;
  let focusNode;
  let focusOffset;
  let counter = 0;
  getTextNodesInNode(navigatorContentEl, node => {
    if (nodeTypeText(node)) {
      counter += node.length;
      if (counter >= focusIndex) {
        focusNode = node;
        focusOffset = focusIndex - (counter - node.length);
        return true; // stop looking for text nodes
      }
    } else if (node.tagName === 'BR') {
      counter += 2;
    }
  });

  return { node: focusNode, offset: focusOffset };
}

export function createSelectionRange(navigatorContentEl) {
  let index;
  let length;
  let counter = 0;
  getTextNodesInNode(navigatorContentEl, node => {
    if (node.id === 'c-s-a-m') {
      index = counter;
    } else if (node.id === 'c-s-f-m') {
      length = counter - index;
      return true; // stop looking for text nodes
    } else if (nodeTypeText(node)) {
      counter += node.length;
    } else if (node.tagName === 'BR') {
      counter += 2;
    }
  });

  return { index, length };
}

export function getStartSelectionOffsets(anchorNode, anchorOffset) {
  const text = anchorNode.nodeValue;

  const beforeStr = text.slice(0, anchorOffset);
  let lastSpaceIndex = beforeStr.lastIndexOf(' ', beforeStr.length);
  let startAnchorOffset;
  if (lastSpaceIndex === -1) {
    startAnchorOffset = 0;
  } else {
    startAnchorOffset = lastSpaceIndex + 1;
  }

  const afterStr = text.slice(startAnchorOffset);
  let startFocusOffset = afterStr.indexOf(' ');
  if (startFocusOffset === -1) startFocusOffset = afterStr.length;

  return [startAnchorOffset, startFocusOffset];
}

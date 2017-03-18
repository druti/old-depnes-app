import { deltaToString } from '../../../../util/delta';
import { getTextNodesInNode, nodeTypeText } from '../../../../util/domNode';

export const ANCHOR_MARKER = '<span id="c-s-a-m"></span>';
export const FOCUS_MARKER = '<span id="c-s-f-m"></span>';

export function convertSelection(content, sel, newContent) {
  const contentString = deltaToString(content);
  const newContentString = deltaToString(newContent);
  const startString = contentString.slice(0, sel.anchor.index);
  const endString = contentString.slice(sel.focus.index);
  const startsWith = newContentString.startsWith(startString)
  const endsWith = newContentString.endsWith(endString)
  // eslint-disable-next-line
  if (startsWith && endsWith) {
    sel.focus.index = newContentString.lastIndexOf(endString);
    const startIndex = (sel.focus.index - sel.anchor.index) / 2 + sel.anchor.index;
    sel.start.index = Math.round(startIndex);
  }
  return sel;
}

export function mapSelectionObjToContent(navigatorContentEl, sel, key) {
  const map = { [key]: {} };

  let counter = 0;
  getTextNodesInNode(navigatorContentEl, node => {
    if (nodeTypeText(node)) {
      counter += node.length;
      if (counter >= sel[key].index) {
        map[key].node = node;
        map[key].offset = sel[key].index - (counter - node.length);
        return true; // stop looking for text nodes
      }
    } else if (node.tagName === 'BR') {
      counter += 2;
    }
  });

  return map;
}

export function createSelectionObjFromContent(navigatorContentEl) {
  const selection = {
    anchor: {
      index: 0,
    },
    start: {
      index: 0,
    },
    focus: {
      index: 0,
    },
  };

  let counter = 0;
  getTextNodesInNode(navigatorContentEl, node => {
    if (node.id === 'c-s-a-m') {
      selection.anchor.index = counter;
    } else if (node.id === 'c-s-s-b') {
      selection.start.index = counter;
    } else if (node.id === 'c-s-f-m') {
      selection.focus.index = counter;
      return true; // stop looking for text nodes
    } else if (nodeTypeText(node)) {
      counter += node.length;
    } else if (node.tagName === 'BR') {
      counter += 2;
    }
  });

  return selection;
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

export function getRange(selection) {
  return {
    index: selection.anchor.index,
    length: selection.focus.index - selection.anchor.index,
  };
}

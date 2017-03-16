import { strip } from '../../../../util/html';

export const ANCHOR_MARKER = '<span id="c-s-a-m"></span>';
export const FOCUS_MARKER = '<span id="c-s-f-m"></span>';

export function getDefaultSelectionOffsets(anchorNode, anchorOffset) {
  const text = anchorNode.nodeValue;

  const beforeStr = text.slice(0, anchorOffset);
  let lastSpaceIndex = beforeStr.lastIndexOf(' ', beforeStr.length);
  let defaultAnchorOffset;
  if (lastSpaceIndex === -1) {
    defaultAnchorOffset = 0;
  } else {
    defaultAnchorOffset = lastSpaceIndex + 1;
  }

  const afterStr = text.slice(defaultAnchorOffset);
  let defaultFocusOffset = afterStr.indexOf(' ');
  if (defaultFocusOffset === -1) defaultFocusOffset = afterStr.length;

  return [defaultAnchorOffset, defaultFocusOffset];
}

export function getSelection(html) {
  const lengthUntilAnchor = strip(
    html.slice(0, html.indexOf(ANCHOR_MARKER))
  ).length;

  const lengthUntilFocus = strip(
    html.slice(0, html.indexOf(FOCUS_MARKER))
  ).length;

  return {
    index: lengthUntilAnchor,
    length: lengthUntilFocus-lengthUntilAnchor,
  };
}

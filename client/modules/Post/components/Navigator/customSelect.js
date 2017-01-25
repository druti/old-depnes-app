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

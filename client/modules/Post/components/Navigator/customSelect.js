export function getDefaultSelectionOffsets(anchorNode, anchorOffset) {
  const text = anchorNode.nodeValue;

  const beforeStr = text.slice(0, anchorOffset);
  const lastSpaceIndex = beforeStr.lastIndexOf(' ', beforeStr.length);
  const defaultAnchorOffset = lastSpaceIndex + 1;

  const afterStr = text.slice(defaultAnchorOffset);
  const defaultFocusOffset = afterStr.indexOf(' ');

  return [defaultAnchorOffset, defaultFocusOffset];
}

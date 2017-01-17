export function getDefaultSelectionOffsets(anchorNode, anchorOffset) {
  const text = anchorNode.nodeValue;

  const beforeStr = text.slice(0, anchorOffset);
  let lastSpaceIndex = beforeStr.lastIndexOf(' ', beforeStr.length);
  if (lastSpaceIndex === -1) lastSpaceIndex = 0;
  const defaultAnchorOffset = lastSpaceIndex + 1;

  const afterStr = text.slice(defaultAnchorOffset);
  let defaultFocusOffset = afterStr.indexOf(' ');
  if (defaultFocusOffset === -1) defaultFocusOffset = afterStr.length;

  return [defaultAnchorOffset, defaultFocusOffset];
}

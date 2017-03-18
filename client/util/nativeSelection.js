export function nodeContainsNativeSelection(node, selection) {
  const { anchorNode, focusNode } = selection;
  if (node.contains(anchorNode) &&
      node.contains(focusNode) &&
      node !== anchorNode &&
      node !== focusNode
    ) {
    return true;
  } else {
    return false;
  }
}

export function clearNativeSelection() {
  var sel = window.getSelection ? window.getSelection() : document.selection;
  if (sel) {
    if (sel.removeAllRanges) {
      sel.removeAllRanges();
    } else if (sel.empty) {
      sel.empty();
    }
  }
}

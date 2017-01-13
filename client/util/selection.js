export function elementContainsSelection(element, selection = window.getSelection()) {
  const { anchorNode, focusNode } = selection;
  if (element.contains(anchorNode) &&
      element.contains(focusNode) &&
      element !== anchorNode &&
      element !== focusNode
    ) {
    return true;
  } else {
    return false;
  }
}

export function clearSelection() {
  var sel = window.getSelection ? window.getSelection() : document.selection;
  if (sel) {
    if (sel.removeAllRanges) {
        sel.removeAllRanges();
    } else if (sel.empty) {
        sel.empty();
    }
  }
}

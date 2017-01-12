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

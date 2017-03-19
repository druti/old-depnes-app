export function getNextNode(node) {
  if (node.nextSibling) {
    return node.nextSibling;
  } else {
    return getNextNode(node.parentNode);
  }
}

export function nodeTypeText(node) {
  return node.nodeType === 3;
}

export function insertElementInTextNode(elStr, textNode, index) {
  const nodeValue = textNode.nodeValue;

  if (nodeTypeText(textNode) && typeof nodeValue === 'string') {
    const beforeText = nodeValue.slice(0, index);
    const afterText = nodeValue.slice(index);
    const replacementStr = [beforeText, elStr, afterText].join('');

    replaceNodeWith(textNode, replacementStr);
  }
}

export function replaceNodeWith(node, htmlStr) {
  if(node.outerHTML) {
    node.outerHTML = htmlStr;
  } else {
    const parent = node.parentNode;
    const tmpNode = document.createElement('div');
    const replaceStr = `<!--${Math.random()} THIS DATA SHOULD BE REPLACED-->`;
    tmpNode.innerHTML = replaceStr;
    parent.replaceChild(tmpNode, node);
    parent.innerHTML = parent.innerHTML.replace(`<div>${replaceStr}</div>`, htmlStr);
  }
}

export function findNearestTextNode(node, direction) {
  if (node.nodeType === 3) {
    return node;
  }

  const forwards = direction !== 'backwards';
  const sibling = forwards ? node.nextSibling : node.previousSibling;
  const siblingTextNodes = getTextNodesInNode(sibling);

  if (siblingTextNodes.length) {
    return forwards ?
      siblingTextNodes[0] :
      siblingTextNodes[siblingTextNodes.length - 1];
  } else {
    const nextNode = sibling ? sibling : node.parentNode;
    return findNearestTextNode(nextNode, direction);
  }
}

export function getTextNodesInNode(n, stop) {
  const textNodes = [];

  function getTextNodes(node) {
    if (node.nodeType === 3) {
      textNodes.push(node);
    }
    if (stop && stop(node)) {
      return true; // stop looking for text nodes
    }
    if (node.nodeType !== 3) {
      const childNodes = node.childNodes;

      for (let i = 0; i < childNodes.length; i++) {
        if (getTextNodes(childNodes[i])) {
          return true;
        }
      }
    }
  }

  if (n) {
    getTextNodes(n);
  }

  return textNodes;
}

export function getTextNode(node, filter) {
  if (node.nodeType === 3) {
    return node;
  } else {
    const childNodes = node.childNodes;

    for (let i = 0; i < childNodes.length; i++) {
      const childNode = childNodes[i];
      if (filter && filter(childNode)) continue;
      const textNode = getTextNode(childNode, filter);
      if (textNode) return textNode;
    }
  }
}

export function getLastTextNode(node, filter) {
  if (node.nodeType === 3) {
    return node;
  } else {
    const childNodes = node.childNodes;

    for (let i = childNodes.length; i-- >= 0;) {
      const childNode = childNodes[i];
      if (!childNode) continue;
      if (filter && filter(childNode)) continue;
      const textNode = getLastTextNode(childNode, filter);
      if (textNode) return textNode;
    }
  }
}

export function insertElementInTextNode(elStr, textNode, index) {
  const nodeValue = textNode.nodeValue;

  if (nodeTypeText(textNode) && typeof nodeValue === 'string') {
    const beforeText = nodeValue.slice(0, index);
    const afterText = nodeValue.slice(index);
    const replacementStr = [beforeText, elStr, afterText].join('');

    replaceNodeWith(textNode, replacementStr);
  }
}


export function nodeTypeText(node) {
  return node.nodeType === 3;
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

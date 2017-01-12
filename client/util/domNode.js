export function insertElementInTextNode(elStr, textNode, index) {
  const nodeValue = textNode.nodeValue;

  if (isNodeTypeText(textNode) && typeof nodeValue === 'string') {
    const beforeText = nodeValue.slice(0, index);
    const afterText = nodeValue.slice(index);
    const beforeNode = document.createTextNode(beforeText);
    const afterNode = document.createTextNode(afterText);
    const replacementStr = [beforeText, elStr, afterText].join('');

    replaceNodeWith(textNode, replacementStr);

    return { beforeNode, afterNode };
  }
}


export function isNodeTypeText(node) {
  return node.nodeType === 3;
}

export function replaceNodeWith(node, htmlStr) {
  if(node.outerHTML) {
    debugger; // eslint-disable-line
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

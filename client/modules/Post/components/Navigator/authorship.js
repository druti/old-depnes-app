export function highlightAuthor(id, color) {
  const quillEl = document.getElementsByClassName('ql-editor')[0];
  if (quillEl) {
    let css =
      `.ql-author-active-${id} .ql-author-${id} { background-color: ${color}; }\n`;
    quillEl.classList.add(`ql-author-active-${id}`);
    addStyle(css);
  }
}

export function unhighlightAuthor(id) {
  const quillEl = document.getElementsByClassName('ql-editor')[0];
  if (quillEl) {
    quillEl.classList.remove(`ql-author-active-${id}`);
  }
}

function addStyle(css) {
  const styleElement = document.createElement('style');
  styleElement.type = 'text/css';
  document.documentElement.getElementsByTagName('head')[0].appendChild(styleElement);
  styleElement.sheet.insertRule(css, 0);
}

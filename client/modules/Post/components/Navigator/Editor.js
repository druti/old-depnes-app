import React, { Component, PropTypes as Type } from 'react';
import Parchment from 'parchment';
import Delta from 'quill-delta';

const isClient = typeof window !== 'undefined'
if (isClient) {
  var Quill = require('quill');
  const Inline = Quill.import('blots/inline');
  const Block = Quill.import('blots/block');

  /*
  class AuthorBlot extends Inline {
    static create({contentAuthorId, formatAuthorId}) {
      const node = super.create();
      node.setAttribute('data-content-author-id', contentAuthorId);
      node.setAttribute('data-format-author-id', formatAuthorId);
      return node;
    }
    static formats(node) {
      return {
        contentAuthorId: node.getAttribute('data-content-author-id'),
        formatAuthorId: node.getAttribute('data-format-author-id'),
      }
    }
  }

  AuthorBlot.blotName = 'authors';
  AuthorBlot.tagName = 'span';
  AuthorBlot.className = 'authors';

  Quill.register(AuthorBlot);
  */
}

class Editor extends Component {
  constructor() {
    super();
    this.state = {};
    this.initQuill = this.initQuill.bind(this);
  }

  componentDidMount() {
    this.initQuill();
  }

  initQuill() {
    let {
      content,
      pathContent,
      pathTextContent,
      onChange,
      auth,
      readOnly
    } = this.props;

    content = readOnly ? pathContent : content;

    this.toolbar = { container: '#navigator-editor-toolbar' };

    // maintain selection
    const previousSelection = this.quill ? this.quill.getSelection() : null;

    const editorElement = $('#depnes-navigator')[0];
    const quill = new Quill(editorElement, {
      readOnly,
      modules: {
        toolbar: !readOnly ? this.toolbar : null,
      },
    });
    editorElement.quill = quill;

    quill.setContents(this.restructureDelta(content));

    if (previousSelection) {
      quill.setSelection(previousSelection);
    }

    quill.on('text-change', (contentChange, oldContent, source) => {
      if (source === 'api') return;
      const newContent = new Delta(oldContent).compose(contentChange);
      onChange(newContent, quill);
    });

    this.quill = quill;
  }

  restructureDelta(delta) {
    if (!delta.authors) return delta;
    delta = JSON.parse(JSON.stringify(delta));
    delta.ops.forEach((op, i) => {
      const authors = delta.authors[i];
      const formats = delta.formats[i];
      if (authors || formats) {
        op.attributes = Object.assign({}, authors, formats);
      }
    });
    delete delta.authors;
    delete delta.formats;
    return delta;
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      readOnly,
      content,
      pathContent,
    } = this.props;

    const quillContent = this.quill.getContents();
    const quillReadOnly = this.quill.options.readOnly;

    if (readOnly !== quillReadOnly) { // reinit with updated config
      this.initQuill();
    } else if (quillReadOnly && quillContent !== pathContent) {
      this.initQuill();
    }
  }

  render() {
    return <div id='depnes-navigator'></div>
  }
}

Editor.propTypes = {
  auth: Type.object.isRequired,
  content: Type.object.isRequired,
  htmlContent: Type.string.isRequired,
  textContent: Type.string.isRequired,
  onChange: Type.func.isRequired,
};

export default Editor;

import React, { Component, PropTypes as Type } from 'react';
import Parchment from 'parchment';
import Delta from 'quill-delta';

const isClient = typeof window !== 'undefined'
if (isClient) {
  var Quill = require('quill');
  const Inline = Quill.import('blots/inline');
  const Block = Quill.import('blots/block');

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
}

class Editor extends Component {
  constructor() {
    super();
    this.state = {};
    this.initQuill = this.initQuill.bind(this);
  }

  initQuill() {
    let {
      content,
      textContent,
      pathContent,
      pathTextContent,
      onChange,
      auth,
      readOnly
    } = this.props;

    content = readOnly ? pathContent : content;
    textContent = readOnly ? pathTextContent : textContent;

    this.toolbar = '#navigator-editor-toolbar';

    // maintain selection
    const previousSelection = this.quill ? this.quill.getSelection() : null;

    const quill = new Quill('#editor', {
      readOnly,
      modules: {
        toolbar: !readOnly ? this.toolbar : null,
      },
    });

    if (content && Object.keys(content).length) { // dummy data had an empty object
      quill.setContents(content);
    } else {
      quill.setText(textContent);
    }

    if (previousSelection) {
      quill.setSelection(previousSelection);
    }

    quill.on('text-change', (contentChange, oldContent, source) => {
      if (source === 'api') {
        return;
      }
      contentChange.ops = contentChange.map(op => {
        if (op.insert) {
          const userId = auth.getProfile().user_id;
          const newAttributes = Object.assign({}, op.attributes, {
            authors: {
              contentAuthorId: userId,
              formatAuthorId: userId,
            },
          });
          // delete format ownership if no formats in insert
          !op.attributes ? delete newAttributes.authors.formatAuthorId : null;
          op.attributes = newAttributes;
        } else if (op.retain){
          const userId = auth.getProfile().user_id;
          const attrs = op.attributes;
          if (attrs) {
            op.attributes = Object.assign(attrs, {
              authors: {
                formatAuthorId: userId,
              },
            });
          }
        }
        return op;
      });
      const newContent = new Delta(this.props.content).compose(contentChange);
      onChange(newContent, quill);
    });

    this.quill = quill;
  }

  componentDidMount() {
    this.initQuill();
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
    return <div id='editor'></div>
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

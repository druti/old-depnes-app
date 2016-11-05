import React, { Component, PropTypes as Type } from 'react';
import Delta from 'quill-delta';

const isClient = typeof window !== 'undefined'
if (isClient) {
  var Quill = require('quill');
  const Block = Quill.import('blots/block');

  class AuthorBlot extends Block {
    static create(contentAuthorId, formatAuthorId) {
      const node = super.create();
      debugger;
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
    format(name, value) {
      debugger;
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
  }

  componentDidMount() {
    const { content, textContent, onChange, auth } = this.props;

    const quill = new Quill('#editor', {
      modules: { toolbar: '#navigator-editor-toolbar' },
    });

    if (content && Object.keys(content).length) { // dummy data had an empty object
      quill.setContents(content);
    } else {
      quill.setText(textContent);
    }

    quill.on('text-change', (contentChange, oldContent, source) => {
      if (source === 'api') {
        return;
      }
      contentChange.ops = contentChange.map(op => {
        if (op.insert) {
          const userId = auth.getProfile().user_id;
          const attr = op.attribute || {};
          op.attributes = Object.assign(attr, {
            authors: {
              contentAuthorId: userId,
              formatAuthorId: userId,
            },
          });
          // delete format ownership if no formats in insert
          !op.attribute ? delete op.attributes.authors.formatAuthorId : null;
        } else if (op.retain){
          const userId = auth.getProfile().user_id;
          const attr = op.attribute;
          if (attr) {
            op.attributes = Object.assign(attr, {
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

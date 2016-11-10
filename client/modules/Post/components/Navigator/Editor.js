import React, { Component, PropTypes as Type } from 'react';
import Parchment from 'parchment';
import Delta from 'quill-delta';

const isClient = typeof window !== 'undefined'
if (isClient) {
  var Quill = require('quill');
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
      onChange,
      auth,
      readOnly
    } = this.props;

    this.toolbar = { container: '#navigator-editor-toolbar' };

    // maintain selection
    const previousSelection = this.quill ? this.quill.getSelection() : null;

    const editorElement = $('#depnes-navigator')[0];
    const quill = new Quill(editorElement, {
      placeholder: 'Compose an epic...',
      readOnly,
      modules: {
        toolbar: !readOnly ? this.toolbar : null,
      },
    });
    editorElement.quill = quill;

    if (content.ops && content.ops.length) {
      quill.setContents(this.restructureDelta(content));
    }

    if (previousSelection) {
      quill.setSelection(previousSelection);
    }

    quill.on('text-change', (contentChange, oldContent, source) => {
      if (source === 'api') return;
      const userId = auth.getProfile().user_id;
      contentChange.ops.forEach(op => {
        if (op.insert) {
          const newAttributes = Object.assign({}, op.attributes, {
            contentAuthorId: userId,
            formatAuthorId: userId,
          });
          // delete format ownership if no formats in insert
          !op.attributes ? delete newAttributes.formatAuthorId : null;
          op.attributes = newAttributes;
        } else if (op.retain){
          const attrs = op.attributes;
          if (attrs) {
            op.attributes = Object.assign(attrs, { formatAuthorId: userId });
          }
        }
      });
      const newContent = new Delta(this.props.content).compose(contentChange);
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
    } = this.props;

    const quillContent = this.quill.getContents();
    const quillReadOnly = this.quill.options.readOnly;

    if (readOnly !== quillReadOnly) { // reinit with updated config
      this.initQuill();
    } else if (quillReadOnly && quillContent !== content) {
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
  onChange: Type.func.isRequired,
};

export default Editor;

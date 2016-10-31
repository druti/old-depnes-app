import React, { Component, PropTypes as Type } from 'react';
import Quill from 'quill';

class Editor extends Component {
  static propTypes = {
    content: Type.object.isRequired,
    htmlContent: Type.string.isRequired,
    textContent: Type.string.isRequired,
    onChange: Type.func.isRequired,
  };

  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    this.quill = new Quill('#editor', {
      theme: 'snow',
    });

    this.quill.on('text-change', delta => this.props.onChange(delta, this.quill));

    const notEmpty = !!Object.keys(this.props.content).length; // dummy data had an empty object

    if (this.props.content && notEmpty) {
      this.quill.setContents(this.props.content);
    } else {
      this.quill.setText(this.props.textContent);
    }
  }

  render() {
    return <div id='editor'></div>
  }
}

export default Editor;

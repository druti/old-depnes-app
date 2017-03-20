import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import EventEmitter from 'events';

import { getNavigator } from '../../PostReducer';

import PostPage from '../../pages/PostPage/PostPage';

import styles from './styles.scss'; // eslint-disable-line

export const navigatorEmitter = new EventEmitter();

const isClient = typeof window !== 'undefined'
if (isClient) {
  var Quill = require('quill');
}

class Editor extends Component {
  constructor() {
    super();
    this.initQuill = this.initQuill.bind(this);
  }

  static propTypes = {
    user: T.object,
    params: T.object.isRequired,
    path: T.object.isRequired,
    selection: T.oneOfType([T.bool, T.object]),
    makeMode: T.bool.isRequired,
    dispatch: T.func.isRequired,
  }

  componentDidMount() {
    this.initQuill();
  }

  initQuill() {
    let {
      path,
      selection,
    } = this.props;

    const editorElement = document.getElementById('depnes-editor');
    const quill = new Quill(editorElement, {
      placeholder: 'Compose an epic...',
      modules: {
        toolbar: {container: '#navigator-editor-toolbar'},
      },
    });
    window.quill = quill;

    quill.setContents(this.restructureDelta(path.content));

    if (selection) {
      quill.setSelection(selection);
    }

    quill.on('text-change', (change, oldContent, source) => {
      if (source === 'api') return;
      PostPage.pathChanges.push(change);
    });

    PostPage.quill = quill;
    PostPage.pathChanges = [];
  }

  restructureDelta(delta) {
    if (!delta.authors) return delta;
    delta = JSON.parse(JSON.stringify(delta));
    delta.ops.forEach((op, i) => {
      const authors = delta.authors[i];
      if (authors) {
        op.attributes = Object.assign(op.attributes || {}, authors);
      }
    });
    delete delta.authors;
    return delta;
  }

  render() {
    return (
      <div id='depnes-editor' className={styles.navigator}></div>
    );
  }
}

function mapStateToProps(state) {
  return {
    ...getNavigator(state),
  };
}

export default connect(mapStateToProps)(Editor);
//export default connect(mapStateToProps, dispatch => ({ dispatch }))(Editor);

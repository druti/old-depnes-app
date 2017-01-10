import React, { Component, PropTypes as Type } from 'react';
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

class Navigator extends Component {
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
      path,
    } = this.props;

    const previousSelection = PostPage.quill ? PostPage.quill.getSelection() : null;

    const editorElement = document.getElementById('#depnes-editor');
    const quill = new Quill(editorElement, {
      placeholder: 'Compose an epic...',
      modules: {
        toolbar: {container: '#navigator-editor-toolbar'},
      },
    });
    window.quill = quill;

    quill.setContents(this.restructureDelta(path.content));

    quill.on('text-change', (change, oldContent, source) => {
      if (source === 'api') return;
      PostPage.pathChanges.push(change);
    });

    if ((previousSelection && previousSelection.length) ||
        PostPage.nextSelection && PostPage.nextSelection.length
    ) {
      quill.setSelection(PostPage.nextSelection || previousSelection);
      delete PostPage.nextSelection;
    }

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

Navigator.propTypes = {
  auth: Type.object.isRequired,
  params: Type.object.isRequired,
  path: Type.object.isRequired,
  makeMode: Type.bool.isRequired,
  dispatch: Type.func.isRequired,
};

function mapStateToProps(state) {
  return {
    ...getNavigator(state),
  };
}

export default connect(mapStateToProps)(Navigator);
//export default connect(mapStateToProps, dispatch => ({ dispatch }))(Navigator);

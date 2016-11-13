import React, { Component, PropTypes as Type } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import EventEmitter from 'events';
import Helmet from 'react-helmet';

import { deltaToString } from '../../../../util/delta';

import { updateSelection, updateEditor } from '../../PostActions';
import { getNavigator } from '../../PostReducer';

import PostPage from '../../pages/PostPage/PostPage';

import styles from './styles.scss'; // eslint-disable-line

export const navigatorEmitter = new EventEmitter();

const isClient = typeof window !== 'undefined'
if (isClient) {
  window.$ = $;
  var Quill = require('quill');
  /*
  const Inline = Quill.import('blots/inline');
  const Block = Quill.import('blots/block');

  class AuthorBlot extends Inline {
    static create(contentAuthorId) {
      const node = super.create();
      node.setAttribute('data-content-author-id', contentAuthorId);
      return node;
    }
    static formats(node) {
      return node.getAttribute('data-content-author-id');
    }
  }

  AuthorBlot.blotName = 'contentAuthorId';
  AuthorBlot.tagName = 'span';
  AuthorBlot.className = 'contentAuthor';

  Quill.register(AuthorBlot);
  */
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

  componentDidUpdate() {
    const {
      path,
      makeMode,
    } = this.props;

    const readOnly = PostPage.quill.options.readOnly;

    if (makeMode === readOnly) { // reinit with updated config
      this.initQuill();
    } else if (readOnly && path.cuid !== PostPage.renderedPathCuid) {
      this.initQuill();
    }
  }

  initQuill() {
    let {
      path,
      selection,
      makeMode,
      dispatch,
    } = this.props;

    const isEmpty =
      (path.content.ops.length === 1) && !path.content.ops[0].insert.trim();

    const editorElement = $('#depnes-navigator')[0];
    const quill = new Quill(editorElement, {
      placeholder: isEmpty ? 'Compose an epic...' : null,
      readOnly: !makeMode,
      modules: {
        toolbar: makeMode ? {container: '#navigator-editor-toolbar'} : null,
      },
    });
    //editorElement.quill = quill;

    quill.on('selection-change', range => {
      //if (source === 'api') return;
      dispatch(updateSelection(range))
    });

    quill.on('text-change', (change, oldContent, source) => {
      if (source === 'api') return;
      dispatch(updateEditor(change))
    });

    quill.setContents(this.restructureDelta(path.content));

    if (selection) {
      quill.setSelection(selection);
    }

    PostPage.quill = quill;
    PostPage.renderedPathCuid = path.cuid;
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
      <div className={styles.container}>
        <Helmet title={deltaToString(this.props.path.content, 30)} />
        <div id='depnes-navigator' className={styles.navigator}></div>
      </div>
    );
  }
}

Navigator.propTypes = {
  auth: Type.object.isRequired,
  path: Type.object.isRequired,
  selection: Type.object,
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

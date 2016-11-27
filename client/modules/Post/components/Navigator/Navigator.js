import React, { Component, PropTypes as Type } from 'react';
import { connect } from 'react-redux';
import $ from 'jquery';
import EventEmitter from 'events';
import Helmet from 'react-helmet';

import Toolbar from './Toolbar';

import { deltaToString } from '../../../../util/delta';

import { getNavigator } from '../../PostReducer';

import PostPage from '../../pages/PostPage/PostPage';

import styles from './styles.scss'; // eslint-disable-line

export const navigatorEmitter = new EventEmitter();

const isClient = typeof window !== 'undefined'
if (isClient) {
  window.$ = $;
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

  componentDidUpdate() {
    this.updateQuill();
  }

  initQuill() {
    let {
      path,
      makeMode,
    } = this.props;

    const previousSelection = PostPage.quill ? PostPage.quill.getSelection() : null;

    //const isEmpty =
    //  (path.content.ops.length === 1) && !path.content.ops[0].insert.trim();

    const editorElement = $('#depnes-navigator')[0];
    const quill = new Quill(editorElement, {
      placeholder: 'Compose an epic...',
      modules: {
        toolbar: {container: '#navigator-editor-toolbar'},
      },
    });
    window.quill = quill;

    quill.enable(makeMode);

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
    PostPage.renderedPathCuid = path.cuid;
  }

  updateQuill() {
    const { path, makeMode } = this.props;

    const previousSelection = PostPage.quill.getSelection();

    PostPage.quill.enable(makeMode);

    if (path.cuid !== PostPage.renderedPathCuid) {
      PostPage.quill.setContents(this.restructureDelta(path.content));
    }

    if ((previousSelection && previousSelection.length) ||
        PostPage.nextSelection && PostPage.nextSelection.length
    ) {
      PostPage.quill.setSelection(PostPage.nextSelection || previousSelection);
      delete PostPage.nextSelection;
    }

    PostPage.pathChanges = [];
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
    const { auth, params } = this.props;
    return (
      <div className={styles.container}>
        <Helmet title={deltaToString(this.props.path.content, 30)} />
        <div id='depnes-navigator' className={styles.navigator}></div>
        <Toolbar auth={auth} params={params} />
      </div>
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

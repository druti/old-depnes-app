import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import EventEmitter from 'events';

import { getPost, getNavigator } from '../../PostReducer';
import { getCurrentUser } from '../../../Auth/AuthReducer';

import Authorship from './authorship';

import PostPage from '../../pages/PostPage/PostPage';

import styles from './styles.scss'; // eslint-disable-line

export const navigatorEmitter = new EventEmitter();

const isClient = typeof window !== 'undefined'
if (isClient) {
  var Quill = require('quill');

  Quill.register('modules/authorship', Authorship);
}

class Editor extends Component {
  static propTypes = {
    user: T.object,
    params: T.object.isRequired,
    path: T.object.isRequired,
    selection: T.oneOfType([T.bool, T.object]),
    makeMode: T.bool.isRequired,
    dispatch: T.func.isRequired,
  }

  constructor() {
    super();
    this.initQuill = this.initQuill.bind(this);
  }

  componentDidMount() {
    this.initQuill();
  }

  initQuill() {
    let {
      path,
      user,
      selection,
    } = this.props;

    const editorElement = document.getElementById('depnes-editor');
    const quill = new Quill(editorElement, {
      placeholder: 'Compose an epic...',
      modules: {
        authorship: {
          enabled: true,
          authorId: user.sid,
          color: 'blue',
        },
        toolbar: {container: '#navigator-editor-toolbar'},
      },
    });
    window.quill = quill;

    quill.setContents(path.content);

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

  render() {
    return (
      <div id='depnes-editor' className={styles.navigator}></div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    ...getNavigator(state),
    path: getPost(state, props.params.sid),
    user: getCurrentUser(state),
  };
}

export default connect(mapStateToProps)(Editor);
//export default connect(mapStateToProps, dispatch => ({ dispatch }))(Editor);

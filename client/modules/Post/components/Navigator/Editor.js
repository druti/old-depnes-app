import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import EventEmitter from 'events';

import { getPost, getNavigator } from '../../PostReducer';
import { getCurrentUser } from '../../../Auth/AuthReducer';

import PostPage from '../../pages/PostPage/PostPage';

import styles from './navigator.scss'; // eslint-disable-line

export const navigatorEmitter = new EventEmitter();

const isClient = typeof window !== 'undefined'
if (isClient) {
  var Quill = require('quill');
  var Authorship = require('./quillAuthorship').default;

  Quill.register('modules/authorship', Authorship);
}

class Editor extends Component {
  static propTypes = {
    user: T.object,
    params: T.object.isRequired,
    post: T.object.isRequired,
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

  componentDidUpdate({ post: prevPost }) {
    const { post } = this.props;
    if (prevPost.sid !== post.sid) {
      this.initQuill();
    }
  }

  initQuill() {
    let {
      post,
      user,
      selection,
    } = this.props;

    const editorElement = document.getElementById('depnes-editor');
    const quill = new Quill(editorElement, {
      placeholder: 'Write something...',
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

    quill.setContents(post.content);

    if (selection) {
      quill.setSelection(selection);
    }

    quill.on('text-change', (change, oldContent, source) => {
      if (source === 'api') return;
      PostPage.postChanges.push(change);
    });

    PostPage.quill = quill;
    PostPage.postChanges = [];
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
    post: getPost(state, props.params.sid),
    user: getCurrentUser(state),
  };
}

export default connect(mapStateToProps)(Editor);
//export default connect(mapStateToProps, dispatch => ({ dispatch }))(Editor);

import React, { Component, PropTypes as T } from 'react';
import Button from 'react-toolbox/lib/button/Button';
import IconButton from 'react-toolbox/lib/button/IconButton';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Delta from 'quill-delta';
import stringify from 'json-stable-stringify';
import ButtonBar from '../../../../components/ButtonBar';
import { LinkIconButton } from '../../../../mdl/Button';
import PostPage from '../../pages/PostPage/PostPage';
import {
  deleteSelection,
  toggleMakeMode,
  addPost,
} from '../../PostActions';
import { openDialog, setRedirectUrl } from '../../../App/AppActions';
import { getNavigator, getPost, getGroupPosts } from '../../PostReducer';
import { getCurrentUser } from '../../../Auth/AuthReducer';
import { deltaToString } from '../../../../util/delta';

import styles from './toolbar.scss'; // eslint-disable-line
import buttonTheme from '../../../../layouts/button.scss'; // eslint-disable-line

class Toolbar extends Component {
  static propTypes = {
    user: T.object,
    params: T.object.isRequired,
    openDialog: T.func.isRequired,
    setRedirectUrl: T.func.isRequired,
    deleteSelection: T.func.isRequired,
    toggleMakeMode: T.func.isRequired,
    addPost: T.func.isRequired,
    selection: T.oneOfType([T.bool, T.object]),
    makeMode: T.bool.isRequired,
    post: T.object,
    posts: T.array,
    className: T.string,
  };

  constructor() {
    super();
    this.state = {};
    this.nextPost = this.nextPost.bind(this);
    this.goToMatchedPost = this.goToMatchedPost.bind(this);
    this.toggleMakeMode = this.toggleMakeMode.bind(this);
    this.savePost = this.savePost.bind(this);
  }

  nextPost(direction) {
    const {
      post,
      posts,
      selection,
    } = this.props;

    if (selection) {
      this.goToMatchedPost(post, posts, navigator, selection, direction);
    } else {
      goToConsecutivePost(post, posts, direction);
    }
  }

  goToMatchedPost(currentPost, posts, navigator, selection, direction) {
    const { nextPost } = getMatchedPost(currentPost, posts, selection, direction);

    if (!nextPost) {
      return this.props.openDialog({
        title: 'No match',
        message: 'No alternatives were found for your selection. Be the first to write one or make a new selection.',
      });
    }

    browserHistory.replace(`/posts/${nextPost.sid}`);
  }

  toggleMakeMode(save = true) {
    const {
      user,
      post,
      makeMode,
    } = this.props;

    if (user) {
      if (makeMode && save) {
        const newContent = PostPage.quill.getContents();
        if (JSON.stringify(newContent) !== JSON.stringify(post.content)) {
          this.savePost(newContent, post.groupId);
        } else {
          return this.props.openDialog({
            title: 'Nothing to save',
            message: 'No new content to save! Write something...',
          });
        }
      }
      this.props.toggleMakeMode();
    } else {
      this.props.setRedirectUrl(location.pathname);
      browserHistory.replace('/login');
    }
  }

  savePost(content, groupId) {
    this.props.addPost({
      groupId,
      content,
      htmlContent: PostPage.quill.root.innerHTML,
    }).then(res => {
      if (!res.post) {
        return this.props.openDialog({
          title: 'Error',
          message: 'Failed to save post. Please try again.',
        });
      }
      browserHistory.push(`/posts/${res.post.sid}`);
      this.props.openDialog({
        title: 'Saved',
        message: 'New post created successfully.',
      });
    });
  }

  render() {
    const { post, posts, selection, makeMode } = this.props;
    return (
      <div className={styles.container}>
        <ButtonBar theme={styles}>
          <div id='navigator-toolbar'>
            {post.sid === 'new' && makeMode &&
              <LinkIconButton
                theme={buttonTheme}
                href='/posts'
              ><i className='fa fa-times'/></LinkIconButton>
            }
            {post.sid !== 'new' && makeMode &&
              <IconButton
                theme={buttonTheme}
                onClick={() => this.toggleMakeMode(false)}
              ><i className='fa fa-times'/></IconButton>
            }

            {!makeMode && posts.length > 1 &&
              <Button
                theme={buttonTheme}
                label='Prev'
                onClick={() => { this.nextPost('backwards')}}
              />
            }

            {selection && !makeMode &&
              <Button
                theme={buttonTheme}
                onClick={() => this.props.deleteSelection()}
                primary
                raised
              ><i className='fa fa-times'/></Button>}

            <Button
              theme={buttonTheme}
              primary
              raised
              label={makeMode ? 'Save' : 'Edit'}
              onClick={this.toggleMakeMode}
            />

            {!makeMode && posts.length > 1 &&
              <Button
                label='Next'
                theme={buttonTheme}
                onClick={() => { this.nextPost('forwards')}}
              />}

            <div
              id='navigator-editor-toolbar'
              className={styles.editorToolbar}
              style={makeMode ? null : { display: 'none' }}
            >
              <span className={styles.separator}/>
              <IconButton
                theme={buttonTheme}
                className='ql-bold'
              ><i className='fa fa-bold'/></IconButton>
              <IconButton
                theme={buttonTheme}
                className='ql-italic'
              ><i className='fa fa-italic'/></IconButton>
              <IconButton
                theme={buttonTheme}
                className='ql-underline'
              ><i className='fa fa-underline'/></IconButton>
              <IconButton
                theme={buttonTheme}
                className='ql-strike'
              ><i className='fa fa-strikethrough'/></IconButton>
              <span className={styles.separator}/>

              <IconButton
                theme={buttonTheme}
                className='ql-size'
                value='large'
              ><i className='fa fa-header'/></IconButton>
              <span className={styles.separator}/>


              <IconButton
                theme={buttonTheme}
                className='ql-list'
                value='ordered'
              ><i className='fa fa-list-ol'/></IconButton>
              <IconButton
                theme={buttonTheme}
                className='ql-list'
                value='bullet'
              ><i className='fa fa-list-ul'/></IconButton>
              <span className={styles.separator}/>


              <IconButton
                theme={buttonTheme}
                className='ql-align'
                value='center'
              ><i className='fa fa-align-center'/></IconButton>
              <IconButton
                theme={buttonTheme}
                className='ql-align'
                value='right'
              ><i className='fa fa-align-right'/></IconButton>
              <IconButton
                theme={buttonTheme}
                className='ql-align'
                value='justify'
              ><i className='fa fa-align-justify'/></IconButton>
            </div>
          </div>
        </ButtonBar>
      </div>
    );
  }
}

function getMatchedPost(currentPost, posts, selection, direction) {
  // Reorder posts, excluding current post and starting at next post
  // eslint-disable-next-line no-param-reassign
  let nextPost;
  let nextPostSelectionLength;
  const currentPostIndex = posts.indexOf(currentPost)
  if (direction === 'forwards') {
    posts = posts
      .slice(currentPostIndex + 1)
      .concat(posts.slice(0, currentPostIndex));
  } else if (direction === 'backwards') {
    posts = posts
      .slice(0, currentPostIndex).reverse()
      .concat(posts.slice(currentPostIndex + 1)).reverse();
  } else {
    return Error('Direction must be forwards or backwards.');
  }

  const currentPostContent = new Delta(copyDelta(currentPost.content));
  const currentPostStartContent = currentPostContent.slice(0, selection.index);
  const currentPostEndContent = currentPostContent.slice(selection.index + selection.length);

  for (let i = 0; i < posts.length; i++) {
    let post = posts[i];
    let postContent = new Delta(copyDelta(post.content));

    const postSelectionLength = postContent.length() - currentPostStartContent.length() - currentPostEndContent.length();
    const postStartContent = postContent.slice(0, selection.index);
    const postEndContent = postContent.slice(selection.index + postSelectionLength);

    const bothStartTheSame =
      stringify(currentPostStartContent) === stringify(postStartContent);
    const bothEndTheSame =
      stringify(currentPostEndContent) === stringify(postEndContent);

    const bothStartTheSame2 =
      deltaToString(currentPostStartContent) === deltaToString(postStartContent);
    const bothEndTheSame2 =
      deltaToString(currentPostEndContent) === deltaToString(postEndContent);

    if ((bothStartTheSame && bothEndTheSame) ||
        (bothStartTheSame2 && bothEndTheSame2)) {
      nextPost = post;
      nextPostSelectionLength = postSelectionLength;
      break;
    }
  }

  return {
    nextPost,
    nextPostSelectionLength,
  };
}

function copyDelta(delta) {
  return JSON.parse(JSON.stringify(delta));
}

function goToConsecutivePost(currentPost, posts, direction) {
  for (let i = 0; i < posts.length; i++) {
    if (posts[i].sid === currentPost.sid) {
      let nextPost = direction === 'forwards' ?
        posts[i + 1] || posts[0] :
        posts[i - 1] || posts[posts.length - 1];
      const url = `/posts/${nextPost.sid}`;
      browserHistory.replace(url);
    }
  }
}

function mapStateToProps(state, props) {
  return {
    post: getPost(state, props.params.sid),
    posts: getGroupPosts(state, props.params.sid),
    user: getCurrentUser(state),
    ...getNavigator(state),
  };
}

export default connect(mapStateToProps, {
  openDialog,
  setRedirectUrl,
  deleteSelection,
  toggleMakeMode,
  addPost,
})(Toolbar);

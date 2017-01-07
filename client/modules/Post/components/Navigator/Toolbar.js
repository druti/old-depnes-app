import React, { Component, PropTypes } from 'react';
import { Button, IconButton } from 'react-toolbox/lib/button';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import Delta from 'quill-delta';
import stringify from 'json-stable-stringify';

import ButtonBar from '../../../../components/ButtonBar';

import { LinkButton, LinkIconButton } from '../../../../mdl/Button';

import PostPage from '../../pages/PostPage/PostPage';

import { deltaToContent, deltaToString } from '../../../../util/delta';

import { toggleMakeMode, addPostRequest } from '../../PostActions';

// Import Selectors
import { getNavigator, getPost, getPosts } from '../../PostReducer';

import styles from './toolbar.scss'; // eslint-disable-line
import buttonTheme from '../../../../layouts/button.scss'; // eslint-disable-line

const isClient = typeof window !== 'undefined'
if (isClient) {
  window.deltaToContent = deltaToContent;
  window.deltaToString = deltaToString;
  window.Delta = Delta;
}

class Toolbar extends Component {
  constructor() {
    super();
    this.state = {};
    this.next = this.next.bind(this);
    this.goToNextMatchedPath = this.goToNextMatchedPath.bind(this);
    this.toggleMakeMode = this.toggleMakeMode.bind(this);
    this.savePath = this.savePath.bind(this);
  }

  next() {
    const {
      path,
      paths,
    } = this.props;

    const selection = PostPage.quill.getSelection();

    if (selection && selection.length) {
      this.goToNextMatchedPath(path, paths, navigator, selection);
    } else {
      goToNextConsecutivePath(path, paths);
    }
  }

  goToNextMatchedPath(currentPath, paths, navigator, selection) {
    const { nextPath, nextPathSelectionLength } = getNextPath(currentPath, paths, selection);

    if (!nextPath) {
      return window.alert('No match found.'); // eslint-disable-line
    }

    PostPage.nextSelection = {
      index: selection.index,
      length: nextPathSelectionLength,
    };

    browserHistory.push(`/paths/${nextPath.cuid}`);
  }

  toggleMakeMode(save = true) { // eslint-disable-line
    const {
      auth,
      path,
      makeMode,
      dispatch,
    } = this.props;

    if (this.context.router.isActive({ pathname: '/paths'})) {
      debugger; //eslint-disable-line
      browserHistory.push('/paths/blank');
    }

    if (makeMode && save) {
      if (PostPage.pathChanges.length) {
        let newContent = associateChangesWithAuthor(
          path,
          PostPage.pathChanges,
          auth.getProfile().user_id
        );
        newContent = deltaToContent(newContent);
        this.savePath(newContent);
      } else {
        return window.alert('No changes to save.');
      }
    }

    dispatch(toggleMakeMode());
  }

  savePath(content) {
    const result = this.props.dispatch(
      addPostRequest({
        content,
        htmlContent: PostPage.quill.root.innerHTML,
      })
    );
    // TODO toggle loading state
    result.then(res => {
      if (!res.post) {
        window.alert('Error creating path');
        return;
      }
      browserHistory.push(`/paths/${res.post.cuid}`);
      window.alert('New path created!');
    });
  }

  render() {
    const { path, makeMode, auth } = this.props;
    return (
      <div className={styles.container}>
        <ButtonBar theme={styles}>
          <div id='navigator-toolbar'>
            {path.cuid === 'blank' && makeMode &&
              <LinkIconButton
                theme={buttonTheme}
                href='/paths'
              ><i className='fa fa-times'/></LinkIconButton>
            }
            {path.cuid !== 'blank' && makeMode &&
              <IconButton
                theme={buttonTheme}
                onClick={() => this.toggleMakeMode(false)}
              ><i className='fa fa-times'/></IconButton>
            }

            {!makeMode &&
              <Button
                raised
                theme={buttonTheme}
                label='Prev'
                onClick={browserHistory && browserHistory.goBack} // no bH during SSR
              />
            }

            {auth.loggedIn() &&
              <Button
                theme={buttonTheme}
                primary
                raised
                label={makeMode ? 'Save' : 'Edit'}
                onClick={this.toggleMakeMode}
              />
            }
            {!auth.loggedIn() &&
              <LinkButton
                theme={buttonTheme}
                primary
                raised
                label='Edit'
                href='/login'
              />
            }

            {!makeMode &&
              <Button
                raised
                label='Next'
                theme={buttonTheme}
                onClick={this.next}
              />
            }

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

Toolbar.propTypes = {
  auth: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  makeMode: PropTypes.bool.isRequired,
  path: PropTypes.object,
  paths: PropTypes.array,
  className: PropTypes.string,
};

Toolbar.contextTypes = {
  router: PropTypes.object.isRequired,
};


function getNextPath(currentPath, paths, selection) {
  // Reorder paths, excluding current path and starting at next path
  // eslint-disable-next-line no-param-reassign
  let nextPath;
  let nextPathSelectionLength;
  const currentPathIndex = paths.indexOf(currentPath)
  paths = paths.slice(currentPathIndex + 1).concat(paths.slice(0, currentPathIndex));

  const currentPathContent = new Delta(cleanDelta(currentPath.content));
  const currentPathStartContent = currentPathContent.slice(0, selection.index);
  const currentPathEndContent = currentPathContent.slice(selection.index + selection.length);

  for (let i = 0; i < paths.length; i++) {
    let path = paths[i];
    let pathContent = new Delta(cleanDelta(path.content));

    const pathSelectionLength = pathContent.length() - currentPathStartContent.length() - currentPathEndContent.length();
    const pathStartContent = pathContent.slice(0, selection.index);
    const pathEndContent = pathContent.slice(selection.index + pathSelectionLength);

    const bothStartTheSame =
      stringify(currentPathStartContent) === stringify(pathStartContent);
    const bothEndTheSame =
      stringify(currentPathEndContent) === stringify(pathEndContent);

    const bothStartTheSame2 =
      deltaToString(currentPathStartContent) === deltaToString(pathStartContent);
    const bothEndTheSame2 =
      deltaToString(currentPathEndContent) === deltaToString(pathEndContent);

    if ((bothStartTheSame && bothEndTheSame) ||
        (bothStartTheSame2 && bothEndTheSame2)) {
      nextPath = path;
      nextPathSelectionLength = pathSelectionLength;
      break;
    }
  }

  return {
    nextPath,
    nextPathSelectionLength,
  };
}

function cleanDelta(delta) {
  delta = JSON.parse(JSON.stringify(delta));
  delete delta.authors;
  return delta;
}

function goToNextConsecutivePath(currentPath, paths) {
  if (currentPath && currentPath.cuid !== 'blank') {
    for (let i = 0; i < paths.length; i++) {
      if (paths[i].cuid === currentPath.cuid) {
        const nextPath = paths[i + 1];
        const url = nextPath ? `/paths/${nextPath.cuid}` : '/paths';
        browserHistory.push(url);
      }
    }
  } else {
    browserHistory.push(`/paths/${paths[0].cuid}`);
  }
}

function associateChangesWithAuthor(path, changes, userId) {
  let newContent = JSON.parse(JSON.stringify(path.content));
  changes.forEach(change => {
    change.ops.forEach(op => {
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
    newContent = new Delta(newContent).compose(change);
  });
  return newContent;
}

function mapStateToProps(state, props) {
  return {
    path: getPost(state, props.params.cuid),
    paths: getPosts(state),
    ...getNavigator(state),
  };
}

export default connect(mapStateToProps, dispatch => ({ dispatch }))(Toolbar);

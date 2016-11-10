import React, { Component, PropTypes } from 'react';
import {AppBar as ToolboxAppBar} from 'react-toolbox/lib/app_bar';
import {Button, IconButton} from 'react-toolbox/lib/button';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import sanitizeHtml from 'sanitize-html';
import { Scrollbars } from 'react-custom-scrollbars';
import Delta from 'quill-delta';
import stringify from 'json-stable-stringify';
import cuid from 'cuid';

import { deltaToString } from '../../../../util/delta';

import { addPost, fetchPosts, updateNavigator, toggleMakeMode, addPostRequest } from '../../PostActions';

// Import Selectors
import { getNavigator, getPost, getPosts } from '../../PostReducer';

import styles from './styles.scss'; // eslint-disable-line
import buttonTheme from './button.scss'; // eslint-disable-line

import { navigatorEmitter } from './Navigator';

const isClient = typeof window !== 'undefined'
if (isClient) {
  window.deltaToString = deltaToString;
}

class AppBar extends Component {
  constructor() {
    super();
    this.state = {};
    this.nextPath = this.nextPath.bind(this);
    this.toggleMakeMode = this.toggleMakeMode.bind(this);
    this.savePath = this.savePath.bind(this);
  }

  nextPath() {
    const {
      path,
      paths,
    } = this.props;

    const $navigator = $('#depnes-navigator');
    if (!$navigator.length) {
      return goToNextConsecutivePath(path, paths);
    }

    const navigator = $navigator[0].quill;
    const navigatorSelection = navigator.getSelection();

    if (navigatorSelection) {
      goToNextMatchedPath(path, paths, navigator, navigatorSelection);
    } else {
      goToNextConsecutivePath(path, paths);
    }
  }

  toggleMakeMode() { // eslint-disable-line
    const {
      path,
      makeMode,
      dispatch,
    } = this.props;

    if (makeMode) {
      //if (JSON.stringify(content) !== JSON.stringify(path.content)) {
      if (true) { // TODO
        const newPathContent = this.restructureDelta(path.content);
        this.savePath(newPathContent);
      }
    }
    dispatch(toggleMakeMode());
  }

  associateChangesWithAuthor(delta, userId) {
    const newDelta = new Delta(delta);
    newDelta.ops.forEach(op => {
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
    return newDelta;
  }

  restructureDelta(delta) {
    delta = JSON.parse(JSON.stringify(delta));
    delta.authors = [];
    delta.formats = [];
    delta.ops.forEach(op => {
      const attributes = op.attributes || {};
      if (attributes.contentAuthorId || attributes.formatAuthorId) {
        // we use jquery extend here to strip undefined values from the merged obj
        delta.authors.push($.extend({}, {
          contentAuthorId: attributes.contentAuthorId,
          formatAuthorId: attributes.formatAuthorId,
        }));
      } else {
        delta.authors.push(null);
      }
      delete attributes.contentAuthorId;
      delete attributes.formatAuthorId;
      // Push remaining quill formats
      delta.formats.push(Object.keys(attributes).length ? attributes : null);
      delete op.attributes; // keep content clean by separating attributes from content
    });
    return delta;
  }

  savePath(content) {
    const result = this.props.dispatch(addPostRequest({content}));
    // TODO toggle loading state
    result.then(res => {
      browserHistory.push(`/paths/${res.post.cuid}`);
    });
  }

  render() {
    const { auth, theme, toggleDrawer, signUp, logIn, makeMode } = this.props;
    return (
      <ToolboxAppBar theme={theme}>
        <Scrollbars className={styles.navigatorAppBarContainer} id='navigator-toolbar'>
          <div className={styles.navigatorAppBar}>
            <IconButton icon='menu' onClick={toggleDrawer} theme={buttonTheme} />
            {!makeMode &&
              <Button
                theme={buttonTheme}
                label='Read'
                onClick={this.nextPath}
              />
            }
            <Button
              theme={buttonTheme}
              primary={makeMode}
              raised={makeMode}
              label={makeMode ? ' Save' : ' Write'}
              onClick={auth.loggedIn() ? this.toggleMakeMode : signUp}
            />
            {makeMode &&
              <div id='navigator-editor-toolbar' className={styles.editorToolbar}>

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
                <span className={styles.separator}/>


                <IconButton
                  theme={buttonTheme}
                  className='ql-link'
                ><i className='fa fa-link'/></IconButton>
                <IconButton
                  theme={buttonTheme}
                  className='ql-image'
                ><i className='fa fa-image'/></IconButton>
                <IconButton
                  theme={buttonTheme}
                  className='ql-video'
                ><i className='fa fa-film'/></IconButton>

              </div>
            }
            {auth.loggedIn() &&
              <Button
                primary={!makeMode}
                theme={buttonTheme}
                label={auth.getProfile().username || auth.getProfile().nickname}
                className={styles.username}
                onClick={() => /*eslint-disable*/console.log(auth.getProfile())/*eslint-enable*/ }
              />
            }
            {!auth.loggedIn() &&
              <Button label='Log In' onClick={logIn} theme={buttonTheme} />
            }
            {!auth.loggedIn() &&
              <Button label='Sign Up' onClick={signUp} theme={buttonTheme} />
            }
          </div>
        </Scrollbars>
      </ToolboxAppBar>
    );
  }
}

AppBar.propTypes = {
  auth: PropTypes.object.isRequired,
  params: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  signUp: PropTypes.func.isRequired,
  logIn: PropTypes.func.isRequired,
  dispatch: PropTypes.func.isRequired,
  makeMode: PropTypes.bool.isRequired,
  path: PropTypes.object,
  paths: PropTypes.array,
  className: PropTypes.string,
};


function goToNextMatchedPath(currentPath, paths, navigator, selection) {
  const { nextPath, nextPathSelectionLength } = getNextPath(currentPath, paths, selection);

  if (!nextPath) {
    return console.warn('No match found.');
  }

  browserHistory.push(`/paths/${nextPath.cuid}`);

  navigatorEmitter.once('componentDidUpdate', () => {
    $('#depnes-navigator')[0].quill.setSelection(selection.index, nextPathSelectionLength);
  });
}


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

    debugger;
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
  delta.ops.forEach(op => delete op.attributes);
  delete delta.authors;
  delete delta.formats;
  return delta;
}

function goToNextConsecutivePath(currentPath, paths) {
  if (currentPath) {
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

function mapStateToProps(state, props) {
  return {
    ...getNavigator(state),
    path: getPost(state, props.params.cuid),
    paths: getPosts(state),
  };
}

export default connect(mapStateToProps, dispatch => ({ dispatch }))(AppBar);

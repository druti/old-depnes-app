import React, { Component, PropTypes } from 'react';
import {AppBar as ToolboxAppBar} from 'react-toolbox/lib/app_bar';
import {Button, IconButton} from 'react-toolbox/lib/button';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import sanitizeHtml from 'sanitize-html';
import { Scrollbars } from 'react-custom-scrollbars';
import Delta from 'quill-delta';
import stringify from 'json-stable-stringify';

import { updateNavigator, toggleMakeMode, addPostRequest } from '../../PostActions';

// Import Selectors
import { getNavigator, getPost, getPosts } from '../../PostReducer';

import styles from './styles.scss'; // eslint-disable-line

import { navigatorEmitter } from './Navigator';

class AppBar extends Component {
  constructor() {
    super();
    this.state = {};
    this.nextPath = this.nextPath.bind(this);
    this.toggleMakeMode = this.toggleMakeMode.bind(this);
  }

  nextPath() {
    const {
      path,
      paths,
    } = this.props;

    const navigator = $('#depnes-navigator')[0].quill; // TODO
    const navigatorSelection = navigator.getSelection(); // TODO

    if (navigatorSelection) {
      goToNextMatchedPath(path, paths, navigator, navigatorSelection);
    }
    else {
      goToNextConsecutivePath(path, paths);
    }
  }

  toggleMakeMode() { // eslint-disable-line
    const {
      content,
      htmlContent,
      textContent,
      makeMode,
      path,
      dispatch,
    } = this.props;

    const pathContent = path.content;

    if (makeMode) {
      if (stringify(content) !== stringify(pathContent) && new Delta(content).length()) {
        const result = dispatch(
          addPostRequest({
            content,
            htmlContent,
            textContent,
          })
        );
        // TODO toggle loading state
        result.then(res => {
          browserHistory.push(`/paths/${res.post.cuid}`);
        });
      }
      dispatch(toggleMakeMode());
    } else {
      dispatch(updateNavigator({
        makeMode: !makeMode,
        content: pathContent,
      }));
    }
  }

  render() {
    const { auth, theme, toggleDrawer, signUp, logIn, makeMode } = this.props;
    return (
      <ToolboxAppBar theme={theme}>
        <Scrollbars className={styles.navigatorAppBarContainer} id='navigator-toolbar'>
          <div className={styles.navigatorAppBar}>
            <IconButton icon='menu' inverse onClick={toggleDrawer}/>
            {!makeMode &&
              <Button
                accent
                label='Read'
                onClick={this.nextPath}
              />
            }
            <Button
              accent
              raised={makeMode}
              label={makeMode ? ' Save' : ' Write'}
              onClick={auth.loggedIn() ? this.toggleMakeMode : signUp}
            />
            {makeMode &&
              <div id='navigator-editor-toolbar' className={styles.editorToolbar}>

                <IconButton
                  inverse
                  className='ql-authors'
                ><i className='fa fa-user'/></IconButton>
                <IconButton
                  inverse
                  className='ql-bold'
                ><i className='fa fa-bold'/></IconButton>
                <IconButton
                  inverse
                  className='ql-italic'
                ><i className='fa fa-italic'/></IconButton>
                <IconButton
                  inverse
                  className='ql-underline'
                ><i className='fa fa-underline'/></IconButton>
                <IconButton
                  inverse
                  className='ql-strike'
                ><i className='fa fa-strikethrough'/></IconButton>
                <span className={styles.separator}/>

                <IconButton
                  inverse
                  className='ql-size'
                  value='large'
                ><i className='fa fa-header'/></IconButton>
                <span className={styles.separator}/>


                <IconButton
                  inverse
                  className='ql-list'
                  value='ordered'
                ><i className='fa fa-list-ol'/></IconButton>
                <IconButton
                  inverse
                  className='ql-list'
                  value='bullet'
                ><i className='fa fa-list-ul'/></IconButton>
                <span className={styles.separator}/>


                <IconButton
                  inverse
                  className='ql-align'
                  value='center'
                ><i className='fa fa-align-center'/></IconButton>
                <IconButton
                  inverse
                  className='ql-align'
                  value='right'
                ><i className='fa fa-align-right'/></IconButton>
                <IconButton
                  inverse
                  className='ql-align'
                  value='justify'
                ><i className='fa fa-align-justify'/></IconButton>
                <span className={styles.separator}/>


                <IconButton
                  inverse
                  className='ql-link'
                ><i className='fa fa-link'/></IconButton>
                <IconButton
                  inverse
                  className='ql-image'
                ><i className='fa fa-image'/></IconButton>
                <IconButton
                  inverse
                  className='ql-video'
                ><i className='fa fa-film'/></IconButton>

              </div>
            }
            {auth.loggedIn() &&
              <Button
                accent
                raised
                label={auth.getProfile().username || auth.getProfile().nickname}
                className={styles.username}
                onClick={() => /*eslint-disable*/console.log(auth.getProfile())/*eslint-enable*/ }
              />
            }
            {!auth.loggedIn() &&
              <Button label='Log In' onClick={logIn} accent />
            }
            {!auth.loggedIn() &&
              <Button label='Sign Up' onClick={signUp} raised accent />
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
  content: PropTypes.object,
  htmlContent: PropTypes.string,
  textContent: PropTypes.string,
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

  const currentPathContent = stripAuthorAttributes(currentPath.content);

  for (let i = 0; i < paths.length; i++) {
    let path = paths[i];
    let pathContent = stripAuthorAttributes(path.content);

    const currentPathStartContent = currentPathContent.slice(0, selection.index);
    const currentPathEndContent = currentPathContent.slice(selection.index + selection.length);

    const pathSelectionLength = pathContent.length() - currentPathStartContent.length() - currentPathEndContent.length();
    const pathStartContent = pathContent.slice(0, selection.index);
    const pathEndContent = pathContent.slice(selection.index + pathSelectionLength);

    const bothStartTheSame =
      stringify(currentPathStartContent) === stringify(pathStartContent);
    const bothEndTheSame =
      stringify(currentPathEndContent) === stringify(pathEndContent);

    if (bothStartTheSame && bothEndTheSame) {
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

function stripAuthorAttributes(content) {
  return new Delta(content.ops.map(op => {
    op = { ...op };
    op.attributes = Object.assign({}, op.attributes);
    op.attributes ? delete op.attributes.authors : null;
    return op;
  }));
}

function goToNextConsecutivePath(currentPath, paths) {
  let nextPathId;
  for (let i = 0; i < paths.length; i++) {
    if (paths[i].cuid === currentPath.cuid) {
      const nextPath = paths[i + 1];
      nextPathId = nextPath ? nextPath.cuid : paths[0].cuid;
    }
  }
  browserHistory.push(`/paths/${nextPathId}`);
}

function mapStateToProps(state, props) {
  return {
    ...getNavigator(state),
    path: getPost(state, props.params.cuid),
    paths: getPosts(state),
  };
}

export default connect(mapStateToProps, dispatch => ({ dispatch }))(AppBar);

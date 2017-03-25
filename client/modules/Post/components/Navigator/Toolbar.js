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
import { setRedirectUrl } from '../../../App/AppActions';
import { getNavigator, getPost, getGroupPosts } from '../../PostReducer';
import { getCurrentUser } from '../../../Auth/AuthReducer';
import { deltaToString } from '../../../../util/delta';

import styles from './toolbar.scss'; // eslint-disable-line
import buttonTheme from '../../../../layouts/button.scss'; // eslint-disable-line

class Toolbar extends Component {
  static propTypes = {
    user: T.object,
    params: T.object.isRequired,
    dispatch: T.func.isRequired,
    selection: T.oneOfType([T.bool, T.object]),
    makeMode: T.bool.isRequired,
    path: T.object,
    paths: T.array,
    className: T.string,
  };

  constructor() {
    super();
    this.state = {};
    this.nextPath = this.nextPath.bind(this);
    this.goToMatchedPath = this.goToMatchedPath.bind(this);
    this.toggleMakeMode = this.toggleMakeMode.bind(this);
    this.savePath = this.savePath.bind(this);
  }

  nextPath(direction) {
    const {
      path,
      paths,
      selection,
    } = this.props;

    if (selection) {
      this.goToMatchedPath(path, paths, navigator, selection, direction);
    } else {
      goToConsecutivePath(path, paths, direction);
    }
  }

  goToMatchedPath(currentPath, paths, navigator, selection, direction) {
    const { nextPath } = getMatchedPath(currentPath, paths, selection, direction);

    if (!nextPath) {
      return window.alert('No match found.');
    }

    browserHistory.replace(`/paths/${nextPath.sid}`);
  }

  toggleMakeMode(save = true) {
    const {
      user,
      path,
      makeMode,
      dispatch,
    } = this.props;

    if (user) {
      if (makeMode && save) {
        const newContent = PostPage.quill.getContents();
        if (JSON.stringify(newContent) !== JSON.stringify(path.content)) {
          this.savePath(newContent, path.groupId);
        } else {
          return window.alert('No changes to save.');
        }
      }
      dispatch(toggleMakeMode());
    } else {
      dispatch(setRedirectUrl(location.pathname))
      browserHistory.replace('/login');
    }
  }

  savePath(content, groupId) {
    const result = this.props.dispatch(
      addPost({
        groupId,
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
      browserHistory.push(`/paths/${res.post.sid}`);
      window.alert('New path created!');
    });
  }

  render() {
    const { path, paths, selection, makeMode, dispatch } = this.props;
    return (
      <div className={styles.container}>
        <ButtonBar theme={styles}>
          <div id='navigator-toolbar'>
            {path.sid === 'blank' && makeMode &&
              <LinkIconButton
                theme={buttonTheme}
                href='/paths'
              ><i className='fa fa-times'/></LinkIconButton>
            }
            {path.sid !== 'blank' && makeMode &&
              <IconButton
                theme={buttonTheme}
                onClick={() => this.toggleMakeMode(false)}
              ><i className='fa fa-times'/></IconButton>
            }

            {!makeMode && paths.length > 1 &&
              <Button
                theme={buttonTheme}
                label='Prev'
                onClick={() => { this.nextPath('backwards')}}
              />
            }

            {selection && !makeMode &&
              <Button
                theme={buttonTheme}
                onClick={() => dispatch(deleteSelection())}
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

            {!makeMode && paths.length > 1 &&
              <Button
                label='Next'
                theme={buttonTheme}
                onClick={() => { this.nextPath('forwards')}}
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

function getMatchedPath(currentPath, paths, selection, direction) {
  // Reorder paths, excluding current path and starting at next path
  // eslint-disable-next-line no-param-reassign
  let nextPath;
  let nextPathSelectionLength;
  const currentPathIndex = paths.indexOf(currentPath)
  if (direction === 'forwards') {
    paths = paths
      .slice(currentPathIndex + 1)
      .concat(paths.slice(0, currentPathIndex));
  } else if (direction === 'backwards') {
    paths = paths
      .slice(0, currentPathIndex).reverse()
      .concat(paths.slice(currentPathIndex + 1)).reverse();
  } else {
    return Error('Direction must be forwards or backwards.');
  }

  const currentPathContent = new Delta(copyDelta(currentPath.content));
  const currentPathStartContent = currentPathContent.slice(0, selection.index);
  const currentPathEndContent = currentPathContent.slice(selection.index + selection.length);

  for (let i = 0; i < paths.length; i++) {
    let path = paths[i];
    let pathContent = new Delta(copyDelta(path.content));

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

function copyDelta(delta) {
  return JSON.parse(JSON.stringify(delta));
}

function goToConsecutivePath(currentPath, paths, direction) {
  for (let i = 0; i < paths.length; i++) {
    if (paths[i].sid === currentPath.sid) {
      let nextPath = direction === 'forwards' ?
        paths[i + 1] || paths[0] :
        paths[i - 1] || paths[paths.length - 1];
      const url = `/paths/${nextPath.sid}`;
      browserHistory.replace(url);
    }
  }
}

function mapStateToProps(state, props) {
  return {
    path: getPost(state, props.params.sid),
    paths: getGroupPosts(state, props.params.sid),
    user: getCurrentUser(state),
    ...getNavigator(state),
  };
}

export default connect(mapStateToProps, dispatch => ({ dispatch }))(Toolbar);

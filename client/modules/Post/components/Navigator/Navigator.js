import React, { Component, PropTypes as Type } from 'react';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import Editor from './Editor';
import Toolbar from './Toolbar';

import { elementContainsSelection } from '../../../../util/selection';
import { deltaToString } from '../../../../util/delta';

import { getNavigator } from '../../PostReducer';

import styles from './styles.scss'; // eslint-disable-line

class Navigator extends Component {
  constructor() {
    super();
    this.state = {};
    this.handleContentClick = this.handleContentClick.bind(this);
  }

  handleContentClick() {
    if (elementContainsSelection(this.refs.content)) {
      console.log('content contains the selection');
      this.initCustomSelect();
    } else {
      console.error('ERRRRROOOORRRRRRRRR');
      debugger;
    }
  }

  initCustomSelect() {
  }

  render() {
    const { auth, params, makeMode, path } = this.props;
    return (
      <div className={styles.container}>
        <Helmet title={deltaToString(this.props.path.content, 30)} />
        {makeMode ?
          <Editor
            auth={auth}
            params={params}
            path={path}
          /> :
          <div className='ql-container'>
            <div
              ref='content'
              className='ql-editor'
              onClick={this.handleContentClick}
              dangerouslySetInnerHTML={{ __html: path.htmlContent }}
            />
          </div>
        }
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

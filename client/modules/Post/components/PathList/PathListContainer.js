import React, { Component, PropTypes as T } from 'react';
import { connect } from 'react-redux';
import { isFetching, hasFetched, getPosts } from '../../PostReducer';
import { fetchPosts } from '../../PostActions';
import PathList from './PathList';

class PathListContainer extends Component {
  static propTypes = {
    loading: T.bool.isRequired,
    loaded: T.bool.isRequired,
    paths: T.array.isRequired,
    dispatch: T.func.isRequired,
  }
  static need = [
    () => { return fetchPosts(); },
  ]
  componentWillMount() {
    this.props.dispatch(fetchPosts());
  }
  render() {
    const { loading, loaded } = this.props;
    return (
      <div>
        <PathList paths={this.props.paths} />
        {(loading || !loaded) && <h1>Loading...</h1>}
      </div>
    );
  }
}

export default connect(
  state => ({
    loading: isFetching(state),
    loaded: hasFetched(state),
    paths: getPosts(state),
  }),
  dispatch => ({dispatch})
)(PathListContainer);

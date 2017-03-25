import React, { Component } from 'react';
import { connect } from 'react-redux';
/*
import { fetchPosts } from '../../PostActions';
*/
//import { browserHistory } from 'react-router';
import Button from 'react-toolbox/lib/button/Button.js';
//import styles from './postListPage.scss'; // eslint-disable-line
//import Loader from '../../../App/components/Loader/Loader';

class Test extends Component { // eslint-disable-line

    /*
  componentDidMount() {
    this.props.dispatch(fetchPosts());
  }
  */

  render() {
    return (
      <div>
        <Button label='Test'/>
      </div>
    );
  }
}

  /*
Test.need = [() => { return fetchPosts(); }];
*/

export default connect()(Test);

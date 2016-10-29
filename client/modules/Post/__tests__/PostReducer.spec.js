import test from 'ava';
import { reducerTest } from 'redux-ava';
import postReducer, { getPost, getPosts } from '../PostReducer';
import { addPost, deletePost, addPosts } from '../PostActions';

test('action for ADD_POST is working', reducerTest(
  postReducer,
  { data: ['foo'] },
  addPost({
    textContent: 'first post',
    content: 'Hello world!',
    _id: null,
    cuid: null,
  }),
  { data: [{
    textContent: 'first post',
    content: 'Hello world!',
    _id: null,
    cuid: null,
  }, 'foo'] },
));

test('action for DELETE_POST is working', reducerTest(
  postReducer,
  { data: [{
    textContent: 'first post',
    content: 'Hello world!',
    cuid: 'abc',
    _id: 1,
  }] },
  deletePost('abc'),
  { data: [] },
));

test('action for ADD_POSTS is working', reducerTest(
  postReducer,
  { data: [] },
  addPosts([
    {
      textContent: 'first post',
      content: 'Hello world!',
      _id: null,
      cuid: null,
    },
  ]),
  { data: [{
    textContent: 'first post',
    content: 'Hello world!',
    _id: null,
    cuid: null,
  }] },
));

test('getPosts selector', t => {
  t.deepEqual(
    getPosts({
      posts: { data: ['foo'] },
    }),
    ['foo']
  );
});

test('getPost selector', t => {
  t.deepEqual(
    getPost({
      posts: { data: [{ cuid: '123' }] },
    }, '123'),
    { cuid: '123' }
  );
});


import React from 'react';
import test from 'ava';
import { shallow } from 'enzyme';
import PostList from '../../components/PostList';

const posts = [
  { textContent: 'Hello Mern', cuid: 'f34gb2bh24b24b2', content: "All cats meow 'mern!'" },
  { textContent: 'Hi Mern', cuid: 'f34gb2bh24b24b3', content: "All dogs bark 'mern!'" },
];

test('renders the list', t => {
  const wrapper = shallow(
    <PostList posts={posts} handleShowPost={() => {}} handleDeletePost={() => {}} />
  );

  t.is(wrapper.find('PostListItem').length, 2);
});

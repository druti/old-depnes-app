import Post from '../models/post';
import cuid from 'cuid';

function parseIn(path) {
  const { ops, formats, authors } = path.content;
  const lastOp = ops[ops.length-1];

  if (!lastOp.insert) {
    console.log('PathId: ', path.id); // eslint-disable-line
    console.log('Operation: \n', lastOp); // eslint-disable-line
    return new Error('!!!!!!!!!!! Unexpected path content operation');
  }

  if (lastOp.insert.endsWith('\n') && lastOp.insert.trim().length) {
    lastOp.insert = lastOp.insert.substring(0, lastOp.insert.lastIndexOf('\n'));
    ops.push({insert: '\n'});
    formats.push(null);
    authors.push(null);
  }
}

/**
 * Get all posts
 * @param req
 * @param res
 * @returns void
 */
export function getPosts(req, res) {
  Post.find().sort('-dateAdded').exec((err, posts) => {
    if (err) {
      res.status(500).send(err);
    }

    res.json({ posts });
  });
}

/**
 * Save a post
 * @param req
 * @param res
 * @returns void
 */
export function addPost(req, res) {
  if (!req.body.post.content) {
    console.log('missing params'); // eslint-disable-line
    res.status(403).end();
  } else {
    const newPost = new Post(req.body.post);

    newPost.cuid = cuid();

    parseIn(newPost);

    newPost.save((err, saved) => {
      if (err) {
        res.status(500).send(err);
      }
      res.json({ post: saved });
    });
  }
}

/**
 * Get a single post
 * @param req
 * @param res
 * @returns void
 */
export function getPost(req, res) {
  Post.findOne({ cuid: req.params.cuid }).exec((err, post) => {
    if (err) {
      res.status(500).send(err);
    }

    res.json({ post });
  });
}

/**
 * Delete a post
 * @param req
 * @param res
 * @returns void
 */
export function deletePost(req, res) {
  Post.findOne({ cuid: req.params.cuid }).exec((err, post) => {
    if (err) {
      res.status(500).send(err);
    }

    post.remove(() => {
      res.status(200).end();
    });
  });
}

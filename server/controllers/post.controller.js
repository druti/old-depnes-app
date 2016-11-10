import Post from '../models/post';
import cuid from 'cuid';

function parseIn(path) {
  function parseLastOp({ops, authors, formats}) {
    if (!ops) return;
    const lastOp = ops[ops.length-1];

    if (!lastOp.insert) {
      ops.pop();
      authors.pop();
      formats.pop();
      parseLastOp(path);
    }
    if (!lastOp.insert.trimRight().length) {
      ops.pop();
      authors.pop();
      formats.pop();
      parseLastOp(path);
    }

    lastOp.insert.trimRight();
  }

  parseLastOp(path.content);
}

function parseOut(paths) {
  paths.forEach(p => {
    if (p.content.ops.length) {
      p.content.ops.push({
        insert: '\n'
      });
      p.content.formats.push(null);
      p.content.authors.push(null);
    }
  });
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

    parseOut(posts);

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
    console.log('missing params');
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

    parseOut([post]);

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

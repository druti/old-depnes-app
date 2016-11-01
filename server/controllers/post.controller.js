import Post from '../models/post';
import cuid from 'cuid';
import sanitizeHtml from 'sanitize-html';

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
  if (!req.body.post.content || !req.body.post.htmlContent || !req.body.post.textContent) {
    console.log('missing params');
    console.log(req.body.post);
    res.status(403).end();
  } else {

    const newPost = new Post(req.body.post);

    // Let's sanitize inputs
    const sanitationOptions = {};
    console.log(newPost.htmlContent);
    newPost.htmlContent = sanitizeHtml(newPost.htmlContent, sanitationOptions);
    newPost.textContent = sanitizeHtml(newPost.textContent, sanitationOptions);
    console.log(newPost.htmlContent);

    newPost.cuid = cuid();
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

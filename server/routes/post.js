import { Router } from 'express'
import authCheck from '../middleware/authCheck'

import * as PostController from '../controllers/post.controller'
const router = new Router()

// Get all Posts
router.route('/posts')
  .get(PostController.getPosts)
  .post(authCheck, PostController.addPost)

// Get one post by cuid
router.route('/posts/:cuid')
  .get(PostController.getPost)


// Delete a post by cuid
router.route('/posts/:cuid')
  .delete(authCheck, PostController.deletePost)

export default router

import express from 'express';
import {
  createPost,
  getAllPosts,
  getMyPosts,
  updatePost,
  deletePost,
  toggleLike,
  addComment,
  getComments,
  getPostsByUser,
} from '../controllers/post.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { upload } from "../middlewares/upload.middleware.js"; // ✅ import multer config

const router = express.Router();

router
  .route("/")
  .get(getAllPosts)
  .post(protect, upload.single("image"), createPost);

router.get("/user/:userId", protect, getPostsByUser);
router.get('/me', protect, getMyPosts);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, toggleLike);
router.post('/:id/comment', protect, addComment);
router.get('/:id/comments', protect, getComments);

export default router;

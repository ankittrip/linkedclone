import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";
import { io } from "../server.js";


export const createPost = async (req, res, next) => {
  try {
    const { text, imageUrl } = req.body;
    let finalImageUrl = imageUrl || "";


    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "linkedclone/posts",
      });
      finalImageUrl = result.secure_url;
    }


    if (!text && !finalImageUrl) {
      return res
        .status(400)
        .json({ success: false, message: "Post must have text or image" });
    }

 
    const post = await Post.create({
      author: req.user._id,
      text,
      imageUrl: finalImageUrl,
    });

    await post.populate("author", "name email");

    res.status(201).json({ success: true, post });
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    next(err);
  }
};



export const getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (err) {
    next(err);
  }
};



export const getMyPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user._id })
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, posts });
  } catch (err) {
    next(err);
  }
};


export const updatePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text, imageUrl } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!post.author.equals(req.user._id))
      return res.status(403).json({ message: "Forbidden" });

    post.text = text ?? post.text;
    post.imageUrl = imageUrl ?? post.imageUrl;
    await post.save();

    const updated = await Post.findById(id).populate("author", "name email");
    res.json({ success: true, post: updated });
  } catch (err) {
    next(err);
  }
};


export const deletePost = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });
    if (!post.author.equals(req.user._id))
      return res.status(403).json({ message: "Forbidden" });

    await post.deleteOne();
    res.json({ success: true, message: "Post deleted successfully" });
  } catch (err) {
    next(err);
  }
};



export const toggleLike = async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user._id;
    const liked = post.likes.includes(userId);

    if (liked) post.likes.pull(userId);
    else post.likes.push(userId);

    await post.save();


    io.emit("postLiked", {
      postId: post._id.toString(),
      likes: post.likes,
    });

    res.json({
      success: true,
      liked: !liked,
      likesCount: post.likes.length,
    });
  } catch (err) {
    next(err);
  }
};


export const addComment = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Comment text required" });

    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });


    post.comments.push({ user: req.user._id, text });
    await post.save();


    const updatedPost = await Post.findById(req.params.id)
      .populate("author", "name email")
      .populate("comments.user", "name email");

   
    io.emit("postCommented", {
      postId: updatedPost._id.toString(),
      comments: updatedPost.comments,
    });

    res.status(201).json({ success: true, post: updatedPost });
  } catch (err) {
    next(err);
  }
};


export const getComments = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "comments.user",
      "name email"
    );
    if (!post) return res.status(404).json({ message: "Post not found" });

    res.json({ success: true, comments: post.comments });
  } catch (err) {
    next(err);
  }
};


export const getPostsByUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({ author: userId })
      .populate("author", "name email")
      .populate("comments.user", "name email")
      .sort({ createdAt: -1 });

    res.json({ success: true, posts });
  } catch (err) {
    console.error("Error fetching user posts:", err);
    next(err);
  }
};

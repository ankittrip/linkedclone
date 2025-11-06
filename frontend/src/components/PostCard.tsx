import { useEffect, useState } from "react";
import api from "../services/api";
import type { Post, Comment } from "../types/types";
import { useAuth } from "../hooks/useAuth";
import { getSocket } from "../services/socket";
import { formatDistanceToNow } from "date-fns";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";

interface PostCardProps {
  post: Post;
  onDelete?: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, onDelete }) => {
  const { _id, text, imageUrl, author, createdAt, likes: initialLikes, comments: initialComments } = post;
  const { token, user } = useAuth();
  const userId = user?._id;

  const [likes, setLikes] = useState<string[]>(initialLikes || []);
  const [comments, setComments] = useState<Comment[]>(initialComments || []);
  const [commentText, setCommentText] = useState("");

  const isOwner = userId === author._id;
  const hasLiked = likes.includes(userId || "");


  useEffect(() => {
    const socket = getSocket();

    const handleLikeUpdate = (data: { postId: string; likes: string[] }) => {
      if (data.postId === _id) setLikes(data.likes);
    };

    const handleCommentUpdate = (data: { postId: string; comments: Comment[] }) => {
      if (data.postId === _id) setComments(data.comments);
    };

    socket.on("postLiked", handleLikeUpdate);
    socket.on("postCommented", handleCommentUpdate);

    return () => {
      socket.off("postLiked", handleLikeUpdate);
      socket.off("postCommented", handleCommentUpdate);
    };
  }, [_id]);

  const handleLike = async () => {
    if (!token) return alert("Please login to like");
    try {
      await api.post(`/posts/${_id}/like`, {}, { headers: { Authorization: `Bearer ${token}` } });
    } catch (err) {
      console.error(err);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !commentText.trim()) return;

    try {
      await api.post(`/posts/${_id}/comment`, { text: commentText }, { headers: { Authorization: `Bearer ${token}` } });
      setCommentText("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!token || !isOwner) return alert("Cannot delete");
    if (!confirm("Are you sure?")) return;

    try {
      await api.delete(`/posts/${_id}`, { headers: { Authorization: `Bearer ${token}` } });
      if (onDelete) onDelete(_id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow">

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold">
            {author.name?.[0] || "U"}
          </div>
          <div>
            <p className="font-semibold">{author.name || "Unknown"}</p>
            <p className="text-xs text-gray-500">
              {createdAt ? formatDistanceToNow(new Date(createdAt), { addSuffix: true }) : ""}
            </p>
          </div>
        </div>
        {isOwner && (
          <button className="text-red-500 font-semibold hover:underline" onClick={handleDelete}>
            Delete
          </button>
        )}
      </div>


      <p className="mb-3">{text}</p>
      {imageUrl && <img src={imageUrl} alt="Post" className="mb-3 rounded max-h-96 w-full object-cover" />}


      <div className="flex items-center gap-4 mb-3">
        <button
          onClick={handleLike}
          className="flex items-center gap-1 px-3 py-1 rounded hover:bg-red-100 transition-colors"
        >
          {hasLiked ? <AiFillHeart className="text-red-500" /> : <AiOutlineHeart />}
          <span>{likes.length}</span>
        </button>

        <div className="flex items-center gap-1 px-3 py-1 rounded bg-gray-200">
          <AiOutlineComment />
          <span>{comments.length}</span>
        </div>
      </div>


      <form onSubmit={handleComment} className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit" className="bg-green-500 text-white px-3 rounded hover:bg-green-600 transition-colors">
          Comment
        </button>
      </form>


      <div className="max-h-60 overflow-y-auto flex flex-col gap-2">
        {comments.map((c) => (
          <div key={c._id} className="text-sm border-b pb-1">
            <span className="font-semibold">{c.user?.name || "Unknown"}: </span>
            {c.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostCard;

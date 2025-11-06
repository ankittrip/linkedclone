import { useEffect, useState } from "react";
import api from "../services/api";
import PostCard from "../components/PostCard";
import PostForm from "../components/PostForm";
import type { Post } from "../types/types";
import { useAuth } from "../hooks/useAuth";
import { initSocket, connectSocket, disconnectSocket, getSocket } from "../services/socket";

const FeedPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  const fetchPosts = async () => {
    try {
      const res = await api.get("/posts", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      setPosts(Array.isArray(res.data.posts) ? res.data.posts : []);
    } catch (err) {
      console.error(err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const addNewPost = (post: Post) => setPosts((prev) => [post, ...prev]);
  const removePost = (postId: string) => setPosts((prev) => prev.filter((p) => p._id !== postId));
  const updateLikes = (postId: string, likes: string[]) =>
    setPosts((prev) => prev.map((post) => (post._id === postId ? { ...post, likes } : post)));
  const updateComments = (postId: string, comments: Post["comments"]) =>
    setPosts((prev) => prev.map((post) => (post._id === postId ? { ...post, comments } : post)));

  useEffect(() => {
    fetchPosts();

    initSocket();
    connectSocket();
    const socket = getSocket();

    socket.on("postLiked", (data: { postId: string; likes: string[] }) => updateLikes(data.postId, data.likes));
    socket.on("postCommented", (data: { postId: string; comments: Post["comments"] }) =>
      updateComments(data.postId, data.comments)
    );

    return () => {
      socket.off("postLiked");
      socket.off("postCommented");
      disconnectSocket();
    };
  }, [token]);

  if (loading)
    return (
      <div className="flex justify-center items-center mt-20 text-gray-500">
        <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-10 h-10"></div>
        <span className="ml-2">Loading posts...</span>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-8 px-2">

      <div className="mb-6">
        <PostForm onPostCreated={addNewPost} />
      </div>


      <div className="flex flex-col gap-6">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet. Be the first to post!</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} onDelete={removePost} />)
        )}
      </div>
    </div>
  );
};

export default FeedPage;

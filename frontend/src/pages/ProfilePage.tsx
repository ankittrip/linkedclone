// src/pages/ProfilePage.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import PostCard from "../components/PostCard";
import ProfileInfo from "../components/ProfileInfo";
import type { Post, User } from "../types/types";
import { useAuth } from "../hooks/useAuth";
import { AiOutlineFileText, AiOutlineHeart, AiOutlineComment } from "react-icons/ai";
import { getSocket, initSocket, connectSocket, disconnectSocket } from "../services/socket";

const ProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [user, setUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();

  // Fetch user info & posts
  useEffect(() => {
    if (!userId) {
      setError("Invalid user ID");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const [userRes, postsRes] = await Promise.all([
          api.get(`/users/${userId}`, { headers }),
          api.get(`/posts/user/${userId}`, { headers }),
        ]);

        setUser(userRes.data);
        setPosts(Array.isArray(postsRes.data.posts) ? postsRes.data.posts : []);
      } catch (err) {
        console.error("Error fetching profile data:", err);
        setUser(null);
        setPosts([]);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, token]);

  // Socket.IO integration
  useEffect(() => {
    initSocket();
    connectSocket();
    const socket = getSocket();

    // Listen for likes update
    const handleLikeUpdate = (data: { postId: string; likes: string[] }) => {
      setPosts((prev) =>
        prev.map((p) => (p._id === data.postId ? { ...p, likes: data.likes } : p))
      );
    };

    // Listen for comments update
    const handleCommentUpdate = (data: { postId: string; comments: Post["comments"] }) => {
      setPosts((prev) =>
        prev.map((p) => (p._id === data.postId ? { ...p, comments: data.comments } : p))
      );
    };

    socket.on("postLiked", handleLikeUpdate);
    socket.on("postCommented", handleCommentUpdate);

    return () => {
      socket.off("postLiked", handleLikeUpdate);
      socket.off("postCommented", handleCommentUpdate);
      disconnectSocket();
    };
  }, []);

  const removePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p._id !== postId));
  };

  if (loading)
    return (
      <div className="flex justify-center mt-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );

  if (error) return <div className="text-center mt-20 text-red-500">{error}</div>;

  if (!user) return <div className="text-center mt-20 text-gray-700">User not found</div>;

  const totalPosts = posts.length;
  const totalLikes = posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
  const totalComments = posts.reduce((sum, p) => sum + (p.comments?.length || 0), 0);

  return (
    <div className="max-w-2xl mx-auto mt-8 px-4">
      <ProfileInfo
        user={user}
        compact={false}
        onUserUpdate={(updatedUser) => setUser(updatedUser)}
      />

      {/* Stats Panel */}
      <div className="flex justify-around mt-4 bg-gray-100 rounded-lg p-3 shadow-sm text-center">
        <div className="flex flex-col items-center gap-1">
          <AiOutlineFileText className="text-2xl text-gray-700" />
          <p className="font-bold">{totalPosts}</p>
          <p className="text-gray-500 text-sm">Posts</p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <AiOutlineHeart className="text-2xl text-red-500" />
          <p className="font-bold">{totalLikes}</p>
          <p className="text-gray-500 text-sm">Likes</p>
        </div>

        <div className="flex flex-col items-center gap-1">
          <AiOutlineComment className="text-2xl text-blue-500" />
          <p className="font-bold">{totalComments}</p>
          <p className="text-gray-500 text-sm">Comments</p>
        </div>
      </div>

      {/* Posts */}
      <div className="mt-6 flex flex-col gap-4">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} onDelete={removePost} />)
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

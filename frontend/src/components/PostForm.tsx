import { useState } from "react";
import api from "../services/api";
import type { Post } from "../types/types";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "./ToastManager";

interface PostFormProps {
  onPostCreated: (post: Post) => void;
}

const PostForm: React.FC<PostFormProps> = ({ onPostCreated }) => {
  const [text, setText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const { token } = useAuth();
  const { addToast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      addToast("Post cannot be empty", "error");
      return;
    }

    const formData = new FormData();
    formData.append("text", text);
    if (imageFile) formData.append("image", imageFile);

    setLoading(true);
    try {
      const res = await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      onPostCreated(res.data.post);
      setText("");
      setImageFile(null);
      addToast("Post created successfully!", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to create post", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 flex flex-col gap-3 p-4 border rounded-lg shadow-sm bg-white">
      <textarea
        className="p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
      />
      {imageFile && (
        <div className="relative">
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="max-h-40 rounded-lg object-cover"
          />
          <button
            type="button"
            onClick={() => setImageFile(null)}
            className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
          >
            ×
          </button>
        </div>
      )}
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-sm text-gray-500"
        />
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="ml-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </form>
  );
};

export default PostForm;

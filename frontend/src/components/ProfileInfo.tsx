import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import type { User } from "../types/types";

interface ProfileInfoProps {
  user: User;
  compact?: boolean;
  onUserUpdate?: (updatedUser: User) => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  user,
  compact = false,
  onUserUpdate,
}) => {
  const { user: currentUser, setUser } = useAuth();
  const isOwner = currentUser?._id === user._id;

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (avatar) formData.append("avatar", avatar);

      const res = await api.put("/users/me", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Profile updated successfully!");
      setUser(res.data.user);


      if (onUserUpdate) onUserUpdate(res.data.user);
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <img
          src={user.avatarUrl || "/default-avatar.png"}
          alt="Avatar"
          className="w-10 h-10 rounded-full"
        />
        <div>
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="border p-4 rounded shadow flex flex-col items-center gap-3">
      <img
        src={
          avatar
            ? URL.createObjectURL(avatar)
            : user.avatarUrl || "/default-avatar.png"
        }
        alt="Avatar"
        className="w-24 h-24 rounded-full object-cover"
      />
      {isOwner ? (
        <>
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
          <input
            type="text"
            className="p-2 border rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            className="p-2 border rounded w-full"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2 disabled:opacity-50"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </>
      ) : (
        <>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </>
      )}
    </div>
  );
};

export default ProfileInfo;

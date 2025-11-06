// src/components/Navbar.tsx
import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ChevronDown } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, setUser, setToken } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    navigate("/login");
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const avatarUrl =
    user?.imageUrl ||
    user?.avatar ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=0D8ABC&color=fff`;

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md sticky top-0 z-50">
      <div className="font-bold text-xl">
        <Link to="/" title="Go to feed" className="hover:opacity-90 transition">
          LinkedClone
        </Link>
      </div>

      {user ? (
        <div className="relative" ref={dropdownRef}>
          {/* Profile Toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-white rounded-md px-2 py-1 hover:bg-blue-700 transition"
          >
            <img
              src={avatarUrl}
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border-2 border-white"
            />
            <span className="hidden sm:block">{user.name}</span>
            <ChevronDown size={18} className={`${open ? "rotate-180" : ""} transition-transform`} />
          </button>

          {/* Dropdown Menu */}
          <div
            className={`absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-lg overflow-hidden z-20 transition-all duration-200 transform ${
              open ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
            }`}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b">
              <img
                src={avatarUrl}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="truncate">
                <p className="font-semibold truncate">{user.name}</p>
                <p className="text-sm text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
            <Link
              to={`/profile/${user._id}`}
              className="block px-4 py-2 hover:bg-gray-100 transition"
              onClick={() => setOpen(false)}
            >
              View Profile
            </Link>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 border-t transition"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link
            to="/login"
            className="hover:underline focus:outline-none focus:ring-2 focus:ring-white transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="hover:underline focus:outline-none focus:ring-2 focus:ring-white transition"
          >
            Signup
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

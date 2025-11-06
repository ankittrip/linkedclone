import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import ProtectedRoute from "./components/ProtectedRoute";
import { initSocket, disconnectSocket } from "./services/socket";
import MainLayout from "./layouts/MainLayout";
import { ToastProvider } from "./components/ToastManager";

function App() {
  useEffect(() => {
    const socket = initSocket();

    socket.on("connect", () => console.log("✅ Connected to Socket.IO:", socket.id));
    socket.on("disconnect", () => console.log("❌ Disconnected from Socket.IO"));

    // Optional global listeners
    socket.on("postLiked", (data) => console.log("🔵 Post liked:", data));
    socket.on("postCommented", (data) => console.log("🟢 New comment:", data));

    return () => {
      socket.off("postLiked");
      socket.off("postCommented");
      disconnectSocket();
    };
  }, []);

  return (
    <AuthProvider>
       <ToastProvider>
      <BrowserRouter>
        <Routes>

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

  
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <FeedPage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile/:userId"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <ProfilePage />
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
       </ToastProvider>
    </AuthProvider>
  );
}

export default App;

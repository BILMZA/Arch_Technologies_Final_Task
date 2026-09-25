import { createContext, useState, useEffect } from "react";
import authService from "../services/authService";
import userService from "../services/userService";
import socket from "../socket";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // Sync token state changes
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  }, [token]);

  // Sync user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  // Fetch full profile if we have user id and token to keep friends and bio up-to-date
  useEffect(() => {
    const initProfile = async () => {
      if (token && user?.id) {
        try {
          const profile = await userService.getProfile(user.id);
          if (profile) {
            setUser((prev) => ({
              ...prev,
              id: profile._id,
              name: profile.name,
              email: profile.email,
              bio: profile.bio || "",
              profilePicture: profile.profilePicture || "",
              privacy: profile.privacy || "public",
              friends: profile.friends || [],
            }));
          }
        } catch (err) {
          console.warn("Could not refresh user profile on init:", err?.message);
        }
      }
      setLoading(false);
    };

    initProfile();
  }, [token, user?.id]);

  const login = async ({ email, password }) => {
    const data = await authService.login({ email, password });
    if (data.token) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data;
  };

  const register = async ({ name, email, password }) => {
    return await authService.register({ name, email, password });
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const next = { ...prev, ...updatedFields };
      localStorage.setItem("user", JSON.stringify(next));
      return next;
    });
  };

  const refreshProfile = async () => {
    if (!user?.id) return;
    try {
      const profile = await userService.getProfile(user.id);
      if (profile) {
        setUser((prev) => ({
          ...prev,
          id: profile._id,
          name: profile.name,
          email: profile.email,
          bio: profile.bio || "",
          profilePicture: profile.profilePicture || "",
          privacy: profile.privacy || "public",
          friends: profile.friends || [],
        }));
      }
    } catch (err) {
      console.error("Error refreshing profile:", err);
    }
  };

  const logout = () => {
    socket.disconnect();
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    register,
    logout,
    updateUser,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { useAuth } from "./useAuth";

export default AuthContext;

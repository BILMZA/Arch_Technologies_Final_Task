import { createContext, useEffect, useState, useCallback } from "react";
import socket from "../socket";
import { useAuth } from "./AuthContext";
import notificationService from "../services/notificationService";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { isAuthenticated, user, refreshProfile } = useAuth();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [newPostAlert, setNewPostAlert] = useState(null);

  // Add toast alert helper
  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random().toString();
    const newToast = { id, ...toast };
    setToasts((prev) => [newToast, ...prev].slice(0, 5));

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch initial notifications when authenticated
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await notificationService.getNotifications();
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    } catch (err) {
      console.warn("Failed to fetch notifications:", err?.message);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      setNotifications([]);
    }
  }, [isAuthenticated, fetchNotifications]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  // Mark all as read locally and remotely
  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    for (const item of unread) {
      try {
        await notificationService.markAsRead(item._id);
      } catch {
        // Continue marking others
      }
    }
  };

  // Socket setup
  useEffect(() => {
    if (!isAuthenticated) {
      if (socket.connected) {
        socket.disconnect();
      }
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    const handleConnect = () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    };

    const handleNewNotification = (notification) => {
      console.log("Real-time notification received:", notification);
      
      // If notification has a recipient and it's not current user, ignore (if recipient populated or id matches)
      const recipientId = notification.recipient?._id || notification.recipient;
      if (recipientId && user?.id && recipientId.toString() !== user.id.toString()) {
        return;
      }

      setNotifications((prev) => [notification, ...prev]);

      // Trigger a toast notification
      const senderName = notification.sender?.name || "Someone";
      let title = "New Notification";
      if (notification.type === "like") title = "Post Liked";
      if (notification.type === "comment") title = "New Comment";
      if (notification.type === "friend_request") title = "Friend Request";
      if (notification.type === "friend_accept") {
        title = "Friend Accepted";
        // Refresh our profile so friends list updates automatically!
        refreshProfile?.();
      }

      addToast({
        title,
        message: `${senderName}: ${notification.message}`,
        type: notification.type || "info",
        avatar: notification.sender?.profilePicture,
        name: senderName,
      });
    };

    const handleNewPost = (post) => {
      console.log("Real-time new post received:", post);
      // If author is not current user, show subtle banner or toast
      const authorId = post.author?._id || post.author;
      if (authorId && user?.id && authorId.toString() !== user.id.toString()) {
        setNewPostAlert(post);
        addToast({
          title: "New Post",
          message: `${post.author?.name || "A user"} shared a new post`,
          type: "post",
          avatar: post.author?.profilePicture,
          name: post.author?.name,
        });
      }
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("newNotification", handleNewNotification);
    socket.on("newPost", handleNewPost);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("newNotification", handleNewNotification);
      socket.off("newPost", handleNewPost);
    };
  }, [isAuthenticated, user?.id, addToast, refreshProfile]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const value = {
    socket,
    isConnected,
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
    toasts,
    addToast,
    removeToast,
    newPostAlert,
    clearNewPostAlert: () => setNewPostAlert(null),
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export { useSocket } from "./useSocket";

export default SocketContext;

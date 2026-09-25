import { useState, useEffect, useCallback } from "react";
import postService from "../services/postService";
import { useSocket } from "../context/SocketContext";
import { useAuth } from "../context/AuthContext";
import PostComposer from "../components/feed/PostComposer";
import PostCard from "../components/feed/PostCard";
import { PostSkeleton } from "../components/common/LoadingSkeleton";
import EmptyState from "../components/common/EmptyState";
import {
  SparklesIcon,
  RefreshIcon,
  GlobeIcon,
  UsersIcon,
  ImageIcon,
} from "../components/common/Icons";

export const FeedPage = ({ searchQuery = "", onUserClick }) => {
  const { user } = useAuth();
  const { socket, newPostAlert, clearNewPostAlert } = useSocket();

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterTab, setFilterTab] = useState("all"); // 'all' | 'friends' | 'media'

  const fetchPosts = useCallback(async () => {
    try {
      const data = await postService.getPosts();
      if (Array.isArray(data)) {
        setPosts(data);
      }
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // Socket listener for new posts emitted by anyone
  useEffect(() => {
    if (!socket) return;

    const handleNewPost = (newPost) => {
      setPosts((prev) => {
        // If already in list, skip
        if (prev.some((p) => p._id === newPost._id)) return prev;
        return [newPost, ...prev];
      });
    };

    socket.on("newPost", handleNewPost);

    return () => {
      socket.off("newPost", handleNewPost);
    };
  }, [socket]);

  const handlePostCreated = (createdPost) => {
    setPosts((prev) => {
      if (prev.some((p) => p._id === createdPost._id)) return prev;
      return [createdPost, ...prev];
    });
  };

  const handleRefreshClick = () => {
    setIsLoading(true);
    fetchPosts();
    clearNewPostAlert();
  };

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const contentMatch = post.content?.toLowerCase().includes(q);
      const authorMatch = post.author?.name?.toLowerCase().includes(q);
      if (!contentMatch && !authorMatch) return false;
    }

    // Tab filter
    if (filterTab === "friends") {
      const authorId = post.author?._id || post.author;
      const isFriend =
        user?.friends &&
        user.friends.some((f) => (f._id || f).toString() === authorId?.toString());
      const isOwn = user?.id && authorId && user.id.toString() === authorId.toString();
      return post.privacy === "friends" || isFriend || isOwn;
    }

    if (filterTab === "media") {
      return Boolean(post.media);
    }

    return true;
  });

  return (
    <div className="w-full max-w-2xl mx-auto py-4 sm:py-6 px-3 sm:px-0">
      {/* Top Feed Tabs & Refresh Bar */}
      <div className="flex items-center justify-between gap-2 mb-4 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setFilterTab("all")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              filterTab === "all"
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <GlobeIcon className="w-3.5 h-3.5" />
            <span>For You</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("friends")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              filterTab === "friends"
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <UsersIcon className="w-3.5 h-3.5" />
            <span>Friends</span>
          </button>

          <button
            type="button"
            onClick={() => setFilterTab("media")}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              filterTab === "media"
                ? "bg-indigo-50 text-indigo-700"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Photos & Videos</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleRefreshClick}
          title="Refresh feed"
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <RefreshIcon className="w-4 h-4" />
        </button>
      </div>

      {/* New Post Real-time Notification Banner */}
      {newPostAlert && (
        <div
          onClick={handleRefreshClick}
          className="mb-4 p-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl shadow-md flex items-center justify-between cursor-pointer hover:shadow-lg transition-shadow animate-fade-in"
        >
          <div className="flex items-center gap-2 text-xs font-semibold">
            <SparklesIcon className="w-4 h-4 text-indigo-200" />
            <span>New post from {newPostAlert.author?.name || "a user"}! Click to view.</span>
          </div>
          <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-medium">
            Jump to top ↑
          </span>
        </div>
      )}

      {/* Post Composer */}
      <PostComposer onPostCreated={handlePostCreated} />

      {/* Feed Stream */}
      {isLoading ? (
        <div className="space-y-4">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      ) : filteredPosts.length === 0 ? (
        <EmptyState
          icon={<GlobeIcon className="w-6 h-6 text-indigo-500" />}
          title="No posts found"
          description={
            searchQuery
              ? `No posts matched "${searchQuery}". Try different keywords.`
              : filterTab === "friends"
              ? "None of your friends have shared any posts yet. Connect with more friends or share your own thoughts!"
              : filterTab === "media"
              ? "No photos or videos have been shared yet. Be the first to upload one!"
              : "The feed is quiet. Share the very first post using the composer above!"
          }
          actionLabel="Refresh Feed"
          onAction={handleRefreshClick}
        />
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onUserClick={onUserClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FeedPage;

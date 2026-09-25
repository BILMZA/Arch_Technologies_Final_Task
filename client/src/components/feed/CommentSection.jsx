import { useState, useEffect, useCallback } from "react";
import commentService from "../../services/commentService";
import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import Avatar from "../common/Avatar";
import { SendIcon } from "../common/Icons";

const formatTimeAgo = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return "just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

export const CommentSection = ({ postId, isOpen, onCommentCountChange }) => {
  const { user } = useAuth();
  const { socket } = useSocket();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await commentService.getComments(postId);
      if (Array.isArray(data)) {
        setComments(data);
        onCommentCountChange?.(data.length);
      }
    } catch (err) {
      console.error("Failed to load comments:", err);
    } finally {
      setIsLoading(false);
    }
  }, [postId, onCommentCountChange]);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, fetchComments]);

  // Real-time socket listener for new comments on this post
  useEffect(() => {
    if (!socket) return;

    const handleNewComment = (comment) => {
      // Check if this comment belongs to current post
      const commentPostId = comment.post?._id || comment.post;
      if (commentPostId && commentPostId.toString() === postId.toString()) {
        setComments((prev) => {
          // Avoid duplicate if already exists
          if (prev.some((c) => c._id === comment._id)) return prev;
          const next = [...prev, comment];
          onCommentCountChange?.(next.length);
          return next;
        });
      }
    };

    socket.on("newComment", handleNewComment);

    return () => {
      socket.off("newComment", handleNewComment);
    };
  }, [socket, postId, onCommentCountChange]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError("");

    try {
      const result = await commentService.createComment(postId, newComment.trim());
      setNewComment("");
      if (result.comment) {
        setComments((prev) => {
          if (prev.some((c) => c._id === result.comment._id)) return prev;
          const next = [...prev, result.comment];
          onCommentCountChange?.(next.length);
          return next;
        });
      }
    } catch (err) {
      console.error("Error posting comment:", err);
      setError("Failed to post comment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="mt-4 pt-4 border-t border-slate-100 animate-fade-in">
      {/* Comment Input */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2.5 mb-4">
        <Avatar
          src={user?.profilePicture}
          name={user?.name || "User"}
          size="sm"
        />

        <div className="relative flex-1">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-800 placeholder:text-slate-400 text-xs sm:text-sm rounded-full pl-4 pr-10 py-2 border border-slate-200/80 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />

          <button
            type="submit"
            disabled={!newComment.trim() || isSubmitting}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-700 disabled:text-slate-300 disabled:cursor-not-allowed p-1.5 rounded-full hover:bg-indigo-50 transition-colors"
          >
            <SendIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>

      {error && <p className="text-xs text-rose-500 mb-2 pl-10">{error}</p>}

      {/* Comment List */}
      {isLoading ? (
        <div className="space-y-3 py-2 pl-2">
          <div className="flex gap-2.5 items-start animate-pulse">
            <div className="w-7 h-7 rounded-full bg-slate-200" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3 bg-slate-200 rounded w-1/4" />
              <div className="h-3 bg-slate-100 rounded w-3/4" />
            </div>
          </div>
        </div>
      ) : comments.length === 0 ? (
        <div className="py-4 text-center">
          <p className="text-xs text-slate-400">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
          {comments.map((comment) => (
            <div
              key={comment._id}
              className="flex items-start gap-2.5 group animate-fade-in"
            >
              <Avatar
                src={comment.author?.profilePicture}
                name={comment.author?.name || "User"}
                size="sm"
              />

              <div className="flex-1 bg-slate-50 rounded-2xl px-3.5 py-2 border border-slate-100">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <span className="text-xs font-semibold text-slate-900">
                    {comment.author?.name || "User"}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-xs text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentSection;

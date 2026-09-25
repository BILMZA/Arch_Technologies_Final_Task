import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import postService from "../../services/postService";
import friendService from "../../services/friendService";
import { getMediaUrl } from "../../services/api";
import Avatar from "../common/Avatar";
import { PrivacyBadge } from "../common/Badge";
import CommentSection from "./CommentSection";
import Modal from "../common/Modal";
import {
  HeartIcon,
  MessageCircleIcon,
  ShareIcon,
  UserPlusIcon,
  CheckIcon,
} from "../common/Icons";

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
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
};

export const PostCard = ({ post, onUserClick }) => {
  const { user } = useAuth();

  const authorId = post.author?._id || post.author?.id || post.author;
  const isOwnPost = user?.id && authorId && user.id.toString() === authorId.toString();

  // Optimistic Likes State
  const initialLiked =
    Array.isArray(post.likes) &&
    post.likes.some((id) => id.toString() === user?.id?.toString());
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(
    Array.isArray(post.likes) ? post.likes.length : 0
  );
  const [isLiking, setIsLiking] = useState(false);

  // Comments State
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentCount, setCommentCount] = useState(0);

  // Friend Request State
  const isAlreadyFriend =
    user?.friends &&
    user.friends.some((f) => {
      const fid = f._id || f;
      return fid.toString() === authorId?.toString();
    });
  const [friendReqSent, setFriendReqSent] = useState(false);
  const [isSendingReq, setIsSendingReq] = useState(false);

  // Image Lightbox Modal State
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  // Share Feedback
  const [shareCopied, setShareCopied] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;

    // Optimistic UI update
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);
    setLikesCount((prev) => (nextLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      setIsLiking(true);
      const res = await postService.likePost(post._id);
      if (res.likes) {
        setLikesCount(res.likes.length);
        setIsLiked(
          res.likes.some((id) => id.toString() === user?.id?.toString())
        );
      }
    } catch (err) {
      console.error("Like toggle failed:", err);
      // Revert optimistic update
      setIsLiked(!nextLiked);
      setLikesCount((prev) => (!nextLiked ? prev + 1 : Math.max(0, prev - 1)));
    } finally {
      setIsLiking(false);
    }
  };

  const handleSendFriendRequest = async () => {
    if (isSendingReq || friendReqSent || isAlreadyFriend || isOwnPost) return;
    try {
      setIsSendingReq(true);
      await friendService.sendFriendRequest(authorId);
      setFriendReqSent(true);
    } catch (err) {
      console.warn("Friend request error:", err?.response?.data?.message || err.message);
      // If error indicates already sent
      if (err?.response?.data?.message?.includes("already")) {
        setFriendReqSent(true);
      }
    } finally {
      setIsSendingReq(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const authorName = post.author?.name || "Unknown User";
  const authorAvatar = post.author?.profilePicture;
  const mediaUrl = post.media ? getMediaUrl(post.media) : null;

  return (
    <article className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs mb-4 transition-all duration-200 hover:shadow-md animate-fade-in">
      {/* Header: Author + Meta + Privacy */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={authorAvatar}
            name={authorName}
            size="md"
            onClick={() => onUserClick?.(authorId)}
          />

          <div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onUserClick?.(authorId)}
                className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer text-left"
              >
                {authorName}
              </button>
              <PrivacyBadge privacy={post.privacy || "public"} size="xs" />
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>{formatTimeAgo(post.createdAt)}</span>
              {post.author?.email && (
                <>
                  <span>•</span>
                  <span className="truncate max-w-[120px] sm:max-w-[200px]">
                    {post.author.email}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick Add Friend if applicable */}
        {!isOwnPost && !isAlreadyFriend && (
          <button
            type="button"
            onClick={handleSendFriendRequest}
            disabled={friendReqSent || isSendingReq}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors cursor-pointer ${
              friendReqSent
                ? "bg-slate-100 text-slate-500 cursor-default"
                : "bg-indigo-50 hover:bg-indigo-100 text-indigo-600"
            }`}
          >
            {friendReqSent ? (
              <>
                <CheckIcon className="w-3.5 h-3.5 text-slate-500" />
                <span>Requested</span>
              </>
            ) : (
              <>
                <UserPlusIcon className="w-3.5 h-3.5" />
                <span>Connect</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Post Text Content */}
      {post.content && (
        <p className="text-slate-800 text-sm sm:text-base leading-relaxed whitespace-pre-line mb-3">
          {post.content}
        </p>
      )}

      {/* Media Content (Image or Video) */}
      {mediaUrl && (
        <div className="relative rounded-xl overflow-hidden bg-slate-950 mb-3 border border-slate-100 max-h-[500px]">
          {post.mediaType === "video" ? (
            <video
              src={mediaUrl}
              controls
              className="w-full max-h-[500px] object-contain mx-auto"
            />
          ) : (
            <img
              src={mediaUrl}
              alt="Post media"
              onClick={() => setIsLightboxOpen(true)}
              className="w-full max-h-[500px] object-cover sm:object-contain mx-auto cursor-zoom-in hover:opacity-95 transition-opacity"
            />
          )}
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-600">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Like Button */}
          <button
            type="button"
            onClick={handleLike}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all duration-150 cursor-pointer ${
              isLiked
                ? "text-rose-600 bg-rose-50 hover:bg-rose-100/80"
                : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            <HeartIcon
              className={`w-4 h-4 transition-transform ${
                isLiked ? "scale-110 text-rose-600" : ""
              }`}
              filled={isLiked}
            />
            <span>{likesCount}</span>
            <span className="hidden sm:inline">
              {likesCount === 1 ? "Like" : "Likes"}
            </span>
          </button>

          {/* Comment Toggle Button */}
          <button
            type="button"
            onClick={() => setIsCommentsOpen(!isCommentsOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              isCommentsOpen
                ? "text-indigo-600 bg-indigo-50"
                : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
            }`}
          >
            <MessageCircleIcon className="w-4 h-4" />
            <span>{commentCount > 0 ? commentCount : ""}</span>
            <span className="hidden sm:inline">Comments</span>
          </button>
        </div>

        {/* Share Button */}
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          {shareCopied ? (
            <>
              <CheckIcon className="w-4 h-4 text-emerald-600" />
              <span className="text-emerald-600 font-medium">Link Copied!</span>
            </>
          ) : (
            <>
              <ShareIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </>
          )}
        </button>
      </div>

      {/* Expandable Comment Section */}
      <CommentSection
        postId={post._id}
        isOpen={isCommentsOpen}
        onCommentCountChange={(count) => setCommentCount(count)}
      />

      {/* Image Lightbox Modal */}
      {post.mediaType !== "video" && mediaUrl && (
        <Modal
          isOpen={isLightboxOpen}
          onClose={() => setIsLightboxOpen(false)}
          maxWidth="max-w-4xl"
          title={authorName}
          subtitle={formatTimeAgo(post.createdAt)}
        >
          <div className="flex flex-col items-center">
            <img
              src={mediaUrl}
              alt="Enlarged view"
              className="max-h-[75vh] w-auto object-contain rounded-lg"
            />
            {post.content && (
              <p className="mt-3 text-sm text-slate-700 text-left w-full">
                {post.content}
              </p>
            )}
          </div>
        </Modal>
      )}
    </article>
  );
};

export default PostCard;

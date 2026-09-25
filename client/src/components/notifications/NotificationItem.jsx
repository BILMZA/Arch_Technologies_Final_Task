import Avatar from "../common/Avatar";
import {
  HeartIcon,
  MessageCircleIcon,
  UserPlusIcon,
  CheckIcon,
  BellIcon,
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
  return `${diffInDays}d ago`;
};

export const NotificationItem = ({
  notification,
  onMarkAsRead,
  onUserClick,
}) => {
  const senderName = notification.sender?.name || "Someone";
  const senderId = notification.sender?._id || notification.sender;
  const isUnread = !notification.read;

  const getTypeIcon = () => {
    switch (notification.type) {
      case "like":
        return (
          <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center">
            <HeartIcon className="w-3 h-3" filled />
          </div>
        );
      case "comment":
        return (
          <div className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-500 flex items-center justify-center">
            <MessageCircleIcon className="w-3 h-3" />
          </div>
        );
      case "friend_request":
        return (
          <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-500 flex items-center justify-center">
            <UserPlusIcon className="w-3 h-3" />
          </div>
        );
      case "friend_accept":
        return (
          <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-500 flex items-center justify-center">
            <CheckIcon className="w-3 h-3" />
          </div>
        );
      default:
        return (
          <div className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center">
            <BellIcon className="w-3 h-3" />
          </div>
        );
    }
  };

  return (
    <div
      onClick={() => {
        if (isUnread) onMarkAsRead?.(notification._id);
      }}
      className={`group relative flex items-start gap-3 p-3.5 rounded-xl transition-all duration-150 cursor-pointer ${
        isUnread
          ? "bg-indigo-50/40 hover:bg-indigo-50/70 border border-indigo-100/60"
          : "hover:bg-slate-50 border border-transparent"
      }`}
    >
      {/* Sender Avatar with badge overlay */}
      <div className="relative shrink-0">
        <Avatar
          src={notification.sender?.profilePicture}
          name={senderName}
          size="md"
          onClick={(e) => {
            e.stopPropagation();
            if (senderId) onUserClick?.(senderId);
          }}
        />
        <div className="absolute -bottom-1 -right-1 ring-2 ring-white rounded-full">
          {getTypeIcon()}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pr-6">
        <p className="text-xs sm:text-sm text-slate-800 leading-snug">
          <span
            onClick={(e) => {
              e.stopPropagation();
              if (senderId) onUserClick?.(senderId);
            }}
            className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors"
          >
            {senderName}
          </span>{" "}
          <span className="text-slate-600">{notification.message}</span>
        </p>

        <span className="inline-block text-[11px] text-slate-400 mt-1 font-medium">
          {formatTimeAgo(notification.createdAt)}
        </span>
      </div>

      {/* Unread indicator dot or mark as read button */}
      {isUnread && (
        <span
          title="Unread notification"
          className="w-2.5 h-2.5 rounded-full bg-indigo-600 shrink-0 mt-2 ring-2 ring-indigo-200"
        />
      )}
    </div>
  );
};

export default NotificationItem;

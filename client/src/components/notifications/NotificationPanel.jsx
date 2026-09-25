import { useState } from "react";
import { useSocket } from "../../context/SocketContext";
import NotificationItem from "./NotificationItem";
import EmptyState from "../common/EmptyState";
import { BellIcon, CheckIcon } from "../common/Icons";

export const NotificationPanel = ({ onUserClick }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useSocket();
  const [filter, setFilter] = useState("all"); // 'all' | 'unread'

  const filtered =
    filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  return (
    <div className="w-full flex flex-col">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold text-slate-900">Notifications</h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
              {unreadCount} new
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllAsRead}
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1 cursor-pointer"
          >
            <CheckIcon className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 my-3 bg-slate-100/80 p-1 rounded-xl">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            filter === "all"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
            filter === "unread"
              ? "bg-white text-slate-900 shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* List */}
      <div className="space-y-1.5 max-h-[460px] overflow-y-auto pr-1">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<BellIcon className="w-6 h-6" />}
            title={filter === "unread" ? "No unread notifications" : "No notifications yet"}
            description={
              filter === "unread"
                ? "You're all caught up with community updates!"
                : "When people like your posts, comment, or connect with you, you'll see it here."
            }
          />
        ) : (
          filtered.map((notification) => (
            <NotificationItem
              key={notification._id}
              notification={notification}
              onMarkAsRead={markAsRead}
              onUserClick={onUserClick}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationPanel;

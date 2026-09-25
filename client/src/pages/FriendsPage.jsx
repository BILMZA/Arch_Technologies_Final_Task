import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import friendService from "../services/friendService";
import FriendCard from "../components/friends/FriendCard";
import SendRequestModal from "../components/friends/SendRequestModal";
import Avatar from "../components/common/Avatar";
import Button from "../components/common/Button";
import EmptyState from "../components/common/EmptyState";
import {
  UsersIcon,
  UserPlusIcon,
  SearchIcon,
  CheckIcon,
  XIcon,
} from "../components/common/Icons";

const formatTimeAgo = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "just now";
  const m = Math.floor(diff / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

export const FriendsPage = ({ onUserClick }) => {
  const { user, refreshProfile } = useAuth();
  const { notifications } = useSocket();

  const [search, setSearch] = useState("");
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);

  const [pendingRequests, setPendingRequests] = useState([]);
  const [isFetchingRequests, setIsFetchingRequests] = useState(false);
  const [handlingIds, setHandlingIds] = useState({});

  const fetchPendingRequests = useCallback(async () => {
    setIsFetchingRequests(true);
    try {
      const data = await friendService.getPendingRequests();
      if (Array.isArray(data)) {
        setPendingRequests(data);
      }
    } catch (err) {
      console.warn("Could not fetch pending requests:", err?.response?.data?.message || err.message);
      setPendingRequests([]);
    } finally {
      setIsFetchingRequests(false);
    }
  }, []);

  useEffect(() => {
    fetchPendingRequests();
  }, [fetchPendingRequests]);

  const friendRequestNotifCount = notifications.filter((n) => n.type === "friend_request").length;
  useEffect(() => {
    fetchPendingRequests();
  }, [friendRequestNotifCount, fetchPendingRequests]);

  const handleAccept = async (requestId) => {
    setHandlingIds((prev) => ({ ...prev, [requestId]: "accepting" }));
    try {
      await friendService.acceptFriendRequest(requestId);
      setPendingRequests((prev) => prev.filter((r) => r._id !== requestId));
      await refreshProfile?.();
    } catch (err) {
      console.error("Accept error:", err?.response?.data?.message || err.message);
    } finally {
      setHandlingIds((prev) => {
        const next = { ...prev };
        delete next[requestId];
        return next;
      });
    }
  };

  const handleReject = async (requestId) => {
    setHandlingIds((prev) => ({ ...prev, [requestId]: "rejecting" }));
    try {
      await friendService.rejectFriendRequest(requestId);
      setPendingRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error("Reject error:", err?.response?.data?.message || err.message);
    } finally {
      setHandlingIds((prev) => {
        const next = { ...prev };
        delete next[requestId];
        return next;
      });
    }
  };

  const friends = Array.isArray(user?.friends) ? user.friends : [];

  const filteredFriends = friends.filter((f) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      f.name?.toLowerCase().includes(q) ||
      f.email?.toLowerCase().includes(q) ||
      f.bio?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="w-full max-w-2xl mx-auto py-4 sm:py-6 px-3 sm:px-0 space-y-6">
      {/* Top Banner & Header */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Friends &amp; Network
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Manage your network, find connections, and expand your community.
          </p>
        </div>

        <Button
          onClick={() => setIsSendModalOpen(true)}
          variant="primary"
          size="sm"
          icon={<UserPlusIcon className="w-4 h-4" />}
        >
          Add Friend by ID
        </Button>
      </div>

      {/* Incoming Friend Requests with Accept / Decline */}
      {pendingRequests.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-indigo-100 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-indigo-600 text-[10px] font-bold text-white">
              {pendingRequests.length}
            </span>
            <h3 className="text-sm font-bold text-slate-900">
              Pending Connection Requests
            </h3>
          </div>

          <div className="space-y-3">
            {pendingRequests.map((req) => {
              const sender = req.sender;
              const senderId = sender?._id || sender;
              const senderName = sender?.name || "A user";
              const isAccepting = handlingIds[req._id] === "accepting";
              const isRejecting = handlingIds[req._id] === "rejecting";
              const isBusy = Boolean(handlingIds[req._id]);

              return (
                <div
                  key={req._id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-indigo-50/40 border border-indigo-100 animate-fade-in"
                >
                  {/* Sender Identity */}
                  <div
                    onClick={() => onUserClick?.(senderId)}
                    className="flex items-center gap-3 cursor-pointer min-w-0"
                  >
                    <Avatar
                      src={sender?.profilePicture}
                      name={senderName}
                      size="md"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-slate-900 hover:text-indigo-600 transition-colors truncate">
                        {senderName}
                      </h4>
                      {sender?.email && (
                        <p className="text-[11px] text-slate-500 truncate">
                          {sender.email}
                        </p>
                      )}
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {formatTimeAgo(req.createdAt)}
                      </p>
                    </div>
                  </div>

                  {/* Accept / Decline Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="success"
                      size="xs"
                      onClick={() => handleAccept(req._id)}
                      isLoading={isAccepting}
                      disabled={isBusy}
                      icon={!isAccepting ? <CheckIcon className="w-3.5 h-3.5" /> : null}
                    >
                      Accept
                    </Button>

                    <Button
                      variant="secondary"
                      size="xs"
                      onClick={() => handleReject(req._id)}
                      isLoading={isRejecting}
                      disabled={isBusy}
                      icon={!isRejecting ? <XIcon className="w-3.5 h-3.5" /> : null}
                    >
                      Decline
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Friends List Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h3 className="text-base font-bold text-slate-900">
            Confirmed Friends ({friends.length})
          </h3>

          <div className="relative w-full sm:w-64">
            <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search friends..."
              className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-xs rounded-xl pl-8 pr-3 py-2 border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
        </div>

        {filteredFriends.length === 0 ? (
          <EmptyState
            icon={<UsersIcon className="w-6 h-6 text-indigo-500" />}
            title={search ? "No friends match your search" : "Your network is empty"}
            description={
              search
                ? `No friends found matching "${search}".`
                : "Connect with people across Nexus by sending connection requests from posts or using their User ID."
            }
            actionLabel={!search ? "Connect with someone" : undefined}
            onAction={!search ? () => setIsSendModalOpen(true) : undefined}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {filteredFriends.map((friend) => (
              <FriendCard
                key={friend._id || friend}
                friend={friend}
                onUserClick={onUserClick}
              />
            ))}
          </div>
        )}
      </div>

      <SendRequestModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        onRequestSent={() => {
          refreshProfile?.();
          fetchPendingRequests();
        }}
      />
    </div>
  );
};

export default FriendsPage;

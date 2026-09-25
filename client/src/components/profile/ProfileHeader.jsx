import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import friendService from "../../services/friendService";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import { PrivacyBadge } from "../common/Badge";
import {
  EditIcon,
  UserPlusIcon,
  CheckIcon,
  UsersIcon,
  ShieldCheckIcon,
} from "../common/Icons";

export const ProfileHeader = ({ profile, postsCount = 0, onEditClick }) => {
  const { user } = useAuth();
  const isOwnProfile =
    user?.id && profile?._id && user.id.toString() === profile._id.toString();

  const isFriend =
    user?.friends &&
    user.friends.some((f) => {
      const fid = f._id || f;
      return fid.toString() === profile?._id?.toString();
    });

  const [requestSent, setRequestSent] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSendFriendRequest = async () => {
    if (isSending || requestSent || isFriend || isOwnProfile) return;
    try {
      setIsSending(true);
      await friendService.sendFriendRequest(profile._id);
      setRequestSent(true);
    } catch (err) {
      console.warn("Friend request error:", err?.response?.data?.message || err.message);
      if (err?.response?.data?.message?.includes("already")) {
        setRequestSent(true);
      }
    } finally {
      setIsSending(false);
    }
  };

  const friendsCount = Array.isArray(profile?.friends)
    ? profile.friends.length
    : 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden mb-6">
      {/* Cover Banner */}
      <div className="h-44 sm:h-52 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 relative">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-white text-xs font-medium flex items-center gap-1.5 shadow-xs">
          <ShieldCheckIcon className="w-3.5 h-3.5" />
          <span>Nexus Profile</span>
        </div>
      </div>

      {/* Profile Details Container */}
      <div className="px-5 sm:px-8 pb-6 relative">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-4">
          {/* Avatar with ring */}
          <div className="relative inline-block">
            <Avatar
              src={profile?.profilePicture}
              name={profile?.name || "User"}
              size="2xl"
              className="ring-4 ring-white shadow-xl bg-white"
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5">
            {isOwnProfile ? (
              <Button
                onClick={onEditClick}
                variant="outline"
                size="sm"
                icon={<EditIcon className="w-4 h-4 text-slate-500" />}
              >
                Edit Profile
              </Button>
            ) : isFriend ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckIcon className="w-4 h-4 text-emerald-600" />
                <span>Friends</span>
              </span>
            ) : (
              <Button
                onClick={handleSendFriendRequest}
                variant="primary"
                size="sm"
                isLoading={isSending}
                disabled={requestSent}
                icon={
                  requestSent ? (
                    <CheckIcon className="w-4 h-4" />
                  ) : (
                    <UserPlusIcon className="w-4 h-4" />
                  )
                }
              >
                {requestSent ? "Request Sent" : "Add Friend"}
              </Button>
            )}
          </div>
        </div>

        {/* User Identity Info */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              {profile?.name || "User"}
            </h1>
            <PrivacyBadge privacy={profile?.privacy || "public"} size="xs" />
          </div>

          <p className="text-xs sm:text-sm text-slate-500">{profile?.email}</p>

          {profile?.bio ? (
            <p className="text-sm text-slate-700 pt-2 max-w-2xl leading-relaxed">
              {profile.bio}
            </p>
          ) : (
            <p className="text-sm text-slate-400 italic pt-1">
              {isOwnProfile ? "Add a bio to let friends know what you're passionate about." : "No bio provided yet."}
            </p>
          )}
        </div>

        {/* Stats Strip */}
        <div className="flex items-center gap-6 pt-5 mt-5 border-t border-slate-100 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">{postsCount}</span>
            <span className="text-slate-500">Posts</span>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="w-4 h-4 text-indigo-500" />
            <span className="font-bold text-slate-900">{friendsCount}</span>
            <span className="text-slate-500">Friends</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;

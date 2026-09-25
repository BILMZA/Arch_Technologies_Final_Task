import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import userService from "../services/userService";
import postService from "../services/postService";
import ProfileHeader from "../components/profile/ProfileHeader";
import EditProfileModal from "../components/profile/EditProfileModal";
import PostCard from "../components/feed/PostCard";
import FriendCard from "../components/friends/FriendCard";
import { ProfileSkeleton, PostSkeleton } from "../components/common/LoadingSkeleton";
import EmptyState from "../components/common/EmptyState";
import { UsersIcon, MessageCircleIcon } from "../components/common/Icons";

export const ProfilePage = ({ userId: targetUserId, onUserClick }) => {
  const { user: currentUser } = useAuth();
  const activeUserId = targetUserId || currentUser?.id;

  const [profile, setProfile] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("posts"); // 'posts' | 'friends'
  const [isEditOpen, setIsEditOpen] = useState(false);

  const fetchProfileAndPosts = useCallback(async () => {
    if (!activeUserId) return;
    setIsLoading(true);

    try {
      // Fetch profile
      const prof = await userService.getProfile(activeUserId);
      setProfile(prof);

      // Fetch user's posts
      const allPosts = await postService.getPosts();
      if (Array.isArray(allPosts)) {
        const filtered = allPosts.filter((p) => {
          const authorId = p.author?._id || p.author?.id || p.author;
          return authorId && authorId.toString() === activeUserId.toString();
        });
        setUserPosts(filtered);
      }
    } catch (err) {
      console.error("Profile load error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [activeUserId]);

  useEffect(() => {
    fetchProfileAndPosts();
  }, [fetchProfileAndPosts]);

  const handleProfileUpdated = (updatedUser) => {
    setProfile((prev) => ({
      ...prev,
      name: updatedUser.name,
      bio: updatedUser.bio,
    }));
  };

  if (isLoading && !profile) {
    return (
      <div className="w-full max-w-2xl mx-auto py-6 px-3 sm:px-0">
        <ProfileSkeleton />
        <PostSkeleton />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="w-full max-w-2xl mx-auto py-10 px-3 sm:px-0">
        <EmptyState
          title="User not found"
          description="The requested profile does not exist or may have been removed."
          actionLabel="Go to Home Feed"
          onAction={() => onUserClick?.(null)}
        />
      </div>
    );
  }

  const friends = Array.isArray(profile.friends) ? profile.friends : [];

  return (
    <div className="w-full max-w-2xl mx-auto py-4 sm:py-6 px-3 sm:px-0">
      {/* Profile Header */}
      <ProfileHeader
        profile={profile}
        postsCount={userPosts.length}
        onEditClick={() => setIsEditOpen(true)}
      />

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4 bg-white p-1 rounded-2xl border border-slate-200/80 shadow-xs">
        <button
          type="button"
          onClick={() => setActiveTab("posts")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "posts"
              ? "bg-indigo-50 text-indigo-700 shadow-xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <MessageCircleIcon className="w-3.5 h-3.5" />
          <span>Posts ({userPosts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("friends")}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === "friends"
              ? "bg-indigo-50 text-indigo-700 shadow-xs"
              : "text-slate-500 hover:text-slate-900"
          }`}
        >
          <UsersIcon className="w-3.5 h-3.5" />
          <span>Friends ({friends.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === "posts" ? (
        <div className="space-y-4">
          {userPosts.length === 0 ? (
            <EmptyState
              icon={<MessageCircleIcon className="w-6 h-6 text-indigo-500" />}
              title="No posts yet"
              description={`${profile.name || "This user"} hasn't published any posts yet.`}
            />
          ) : (
            userPosts.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                onUserClick={onUserClick}
              />
            ))
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {friends.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                icon={<UsersIcon className="w-6 h-6 text-indigo-500" />}
                title="No friends yet"
                description={`${profile.name || "This user"} doesn't have any mutual connections yet.`}
              />
            </div>
          ) : (
            friends.map((friend) => (
              <FriendCard
                key={friend._id || friend}
                friend={friend}
                onUserClick={onUserClick}
              />
            ))
          )}
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onProfileUpdated={handleProfileUpdated}
      />
    </div>
  );
};

export default ProfilePage;

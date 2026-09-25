import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import AuthPage from "./pages/AuthPage";
import FeedPage from "./pages/FeedPage";
import ProfilePage from "./pages/ProfilePage";
import FriendsPage from "./pages/FriendsPage";
import NotificationsPage from "./pages/NotificationsPage";

import Navbar from "./components/layout/Navbar";
import Sidebar from "./components/layout/Sidebar";
import RightSidebar from "./components/layout/RightSidebar";
import MobileNav from "./components/layout/MobileNav";

import ToastContainer from "./components/common/ToastContainer";
import CreatePostModal from "./components/feed/CreatePostModal";
import PrivacyModal from "./components/settings/PrivacyModal";
import SendRequestModal from "./components/friends/SendRequestModal";
import Modal from "./components/common/Modal";
import NotificationPanel from "./components/notifications/NotificationPanel";

function MainApp() {
  const { isAuthenticated, user, refreshProfile } = useAuth();

  const [activeTab, setActiveTab] = useState("feed"); // 'feed' | 'notifications' | 'friends' | 'profile'
  const [viewingUserId, setViewingUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isSendRequestOpen, setIsSendRequestOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "profile") {
      setViewingUserId(user?.id);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleUserClick = (targetUserId) => {
    if (targetUserId) {
      setViewingUserId(targetUserId);
      setActiveTab("profile");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setActiveTab("feed");
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case "feed":
        return (
          <FeedPage
            searchQuery={searchQuery}
            onUserClick={handleUserClick}
          />
        );
      case "profile":
        return (
          <ProfilePage
            userId={viewingUserId || user?.id}
            onUserClick={handleUserClick}
          />
        );
      case "friends":
        return <FriendsPage onUserClick={handleUserClick} />;
      case "notifications":
        return <NotificationsPage onUserClick={handleUserClick} />;
      default:
        return (
          <FeedPage
            searchQuery={searchQuery}
            onUserClick={handleUserClick}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Real-time Toast Notifications */}
      <ToastContainer />

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onNotificationClick={() => setIsNotifDropdownOpen(true)}
        onUserClick={handleUserClick}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main 3-Column Layout */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex items-start justify-center pb-20 lg:pb-8">
        {/* Left Sticky Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onNewPostClick={() => setIsCreatePostOpen(true)}
          onPrivacyClick={() => setIsPrivacyOpen(true)}
        />

        {/* Center Dynamic Feed / Page Stream */}
        <main className="flex-1 min-w-0 max-w-2xl px-3 sm:px-6">
          {renderContent()}
        </main>

        {/* Right Sticky Widget Column */}
        <RightSidebar
          onOpenSendRequest={() => setIsSendRequestOpen(true)}
          onOpenPrivacy={() => setIsPrivacyOpen(true)}
          onViewProfile={(uid) => handleUserClick(uid)}
        />
      </div>

      {/* Mobile Fixed Bottom Navigation */}
      <MobileNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onNewPostClick={() => setIsCreatePostOpen(true)}
      />

      {/* Create Post Global Modal */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPostCreated={() => {
          setActiveTab("feed");
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />

      {/* Privacy Settings Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

      {/* Add Friend by ID Modal */}
      <SendRequestModal
        isOpen={isSendRequestOpen}
        onClose={() => setIsSendRequestOpen(false)}
        onRequestSent={() => refreshProfile?.()}
      />

      {/* Quick Notifications Modal / Dropdown */}
      <Modal
        isOpen={isNotifDropdownOpen}
        onClose={() => setIsNotifDropdownOpen(false)}
        maxWidth="max-w-md"
      >
        <NotificationPanel
          onUserClick={(uid) => {
            setIsNotifDropdownOpen(false);
            handleUserClick(uid);
          }}
          onClose={() => setIsNotifDropdownOpen(false)}
        />
      </Modal>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <MainApp />
      </SocketProvider>
    </AuthProvider>
  );
}
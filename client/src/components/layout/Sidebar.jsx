import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import {
  HomeIcon,
  BellIcon,
  UsersIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  PlusIcon,
  SparklesIcon,
} from "../common/Icons";

export const Sidebar = ({
  activeTab,
  onTabChange,
  onNewPostClick,
  onPrivacyClick,
}) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useSocket();

  const navItems = [
    { id: "feed", label: "Home Feed", icon: <HomeIcon className="w-5 h-5" /> },
    {
      id: "notifications",
      label: "Notifications",
      icon: <BellIcon className="w-5 h-5" />,
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      id: "friends",
      label: "Friends & Network",
      icon: <UsersIcon className="w-5 h-5" />,
    },
    {
      id: "profile",
      label: "My Profile",
      icon: <UserIcon className="w-5 h-5" />,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col justify-between w-64 xl:w-72 h-screen sticky top-0 px-4 py-6 border-r border-slate-200/80 bg-white select-none">
      {/* Top Section */}
      <div className="space-y-6">
        {/* Brand Header */}
        <div
          onClick={() => onTabChange("feed")}
          className="flex items-center gap-3 px-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
              Nexus
            </h1>
            <span className="text-[11px] font-medium text-slate-400">
              Social Community
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? "bg-indigo-50 text-indigo-700 shadow-xs"
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={
                      isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"
                    }
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-indigo-600 text-white">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Privacy & Settings */}
          <button
            type="button"
            onClick={onPrivacyClick}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <SettingsIcon className="w-5 h-5 text-slate-400" />
            <span>Privacy & Settings</span>
          </button>
        </nav>

        {/* New Post Button */}
        <div className="pt-2">
          <Button
            onClick={onNewPostClick}
            variant="primary"
            size="md"
            className="w-full py-3 shadow-md shadow-indigo-600/20"
            icon={<PlusIcon className="w-4 h-4" />}
          >
            Create Post
          </Button>
        </div>
      </div>

      {/* Bottom User Card */}
      <div className="pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-slate-50 transition-colors">
          <div
            onClick={() => onTabChange("profile")}
            className="flex items-center gap-3 min-w-0 cursor-pointer flex-1"
          >
            <Avatar
              src={user?.profilePicture}
              name={user?.name || "User"}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-bold text-slate-900 truncate">
                {user?.name || "User"}
              </h4>
              <p className="text-[11px] text-slate-400 truncate">
                {user?.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={logout}
            title="Log Out"
            className="text-slate-400 hover:text-rose-600 p-2 rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <LogOutIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import Avatar from "../common/Avatar";
import { BellIcon, SearchIcon, SparklesIcon } from "../common/Icons";

export const Navbar = ({
  onTabChange,
  onNotificationClick,
  onUserClick,
  searchQuery,
  onSearchChange,
}) => {
  const { user } = useAuth();
  const { unreadCount, isConnected } = useSocket();

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Mobile Brand Title */}
        <div
          onClick={() => onTabChange?.("feed")}
          className="flex items-center gap-2.5 lg:hidden cursor-pointer"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <SparklesIcon className="w-5 h-5 text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight text-slate-900">
            Nexus
          </span>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1 max-w-md hidden sm:block">
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
            <SearchIcon className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder="Search posts, friends, ideas..."
            className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm rounded-full pl-9 pr-4 py-2 border border-transparent focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>

        {/* Right Actions: Socket status, Notifications Bell, Avatar */}
        <div className="flex items-center gap-3">
          {/* Socket live indicator */}
          <div
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border bg-slate-50 border-slate-200 text-slate-600"
            title={isConnected ? "Real-time updates active" : "Connecting..."}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
              }`}
            />
            <span>{isConnected ? "Live" : "Connecting"}</span>
          </div>

          {/* Notifications Bell button */}
          <button
            type="button"
            onClick={onNotificationClick}
            className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <BellIcon className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* User Avatar */}
          <div
            onClick={() => onUserClick?.(user?.id)}
            className="cursor-pointer"
          >
            <Avatar
              src={user?.profilePicture}
              name={user?.name || "User"}
              size="sm"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

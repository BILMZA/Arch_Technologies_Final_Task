import { useSocket } from "../../context/SocketContext";
import {
  HomeIcon,
  BellIcon,
  UsersIcon,
  UserIcon,
  PlusIcon,
} from "../common/Icons";

export const MobileNav = ({ activeTab, onTabChange, onNewPostClick }) => {
  const { unreadCount } = useSocket();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-2 py-2 flex items-center justify-around shadow-lg">
      <button
        type="button"
        onClick={() => onTabChange("feed")}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors cursor-pointer ${
          activeTab === "feed" ? "text-indigo-600 font-bold" : "text-slate-500"
        }`}
      >
        <HomeIcon className="w-5 h-5" />
        <span className="text-[10px]">Home</span>
      </button>

      <button
        type="button"
        onClick={() => onTabChange("friends")}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors cursor-pointer ${
          activeTab === "friends" ? "text-indigo-600 font-bold" : "text-slate-500"
        }`}
      >
        <UsersIcon className="w-5 h-5" />
        <span className="text-[10px]">Friends</span>
      </button>

      {/* Floating Center Create Button */}
      <button
        type="button"
        onClick={onNewPostClick}
        className="w-11 h-11 -mt-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 active:scale-95 transition-transform cursor-pointer"
        aria-label="New Post"
      >
        <PlusIcon className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => onTabChange("notifications")}
        className={`relative flex flex-col items-center gap-1 p-2 rounded-xl transition-colors cursor-pointer ${
          activeTab === "notifications" ? "text-indigo-600 font-bold" : "text-slate-500"
        }`}
      >
        <BellIcon className="w-5 h-5" />
        <span className="text-[10px]">Alerts</span>
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white" />
        )}
      </button>

      <button
        type="button"
        onClick={() => onTabChange("profile")}
        className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors cursor-pointer ${
          activeTab === "profile" ? "text-indigo-600 font-bold" : "text-slate-500"
        }`}
      >
        <UserIcon className="w-5 h-5" />
        <span className="text-[10px]">Profile</span>
      </button>
    </nav>
  );
};

export default MobileNav;

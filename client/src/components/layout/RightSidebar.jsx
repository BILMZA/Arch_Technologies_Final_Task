import { useAuth } from "../../context/AuthContext";
import { useSocket } from "../../context/SocketContext";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import { UserPlusIcon, ShieldCheckIcon } from "../common/Icons";


export const RightSidebar = ({
  onOpenSendRequest,
  onOpenPrivacy,
  onViewProfile,
}) => {
  const { user } = useAuth();
  const { isConnected } = useSocket();

  const friendsCount = Array.isArray(user?.friends) ? user.friends.length : 0;

  return (
    <aside className="hidden xl:flex flex-col gap-5 w-80 h-screen sticky top-0 px-4 py-6 border-l border-slate-200/80 bg-white/50 backdrop-blur-xs overflow-y-auto">
      {/* Mini Profile Card */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3 mb-3">
          <Avatar
            src={user?.profilePicture}
            name={user?.name || "User"}
            size="lg"
            className="ring-2 ring-indigo-50"
          />
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {user?.name || "User"}
            </h3>
            <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-indigo-600 font-medium">
              <span>{friendsCount}</span>
              <span>{friendsCount === 1 ? "Friend" : "Friends"}</span>
            </div>
          </div>
        </div>

        {user?.bio && (
          <p className="text-xs text-slate-600 line-clamp-2 mb-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            {user.bio}
          </p>
        )}

        <Button
          variant="outline"
          size="xs"
          className="w-full"
          onClick={() => onViewProfile(user?.id)}
        >
          View Full Profile
        </Button>
      </div>

      {/* Network & Connect Widget */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <UserPlusIcon className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Network
            </h4>
          </div>
        </div>

        <p className="text-xs text-slate-500 mb-3 leading-relaxed">
          Connect with colleagues and friends by sending a connection request.
        </p>

        <Button
          variant="secondary"
          size="sm"
          className="w-full"
          onClick={onOpenSendRequest}
          icon={<UserPlusIcon className="w-3.5 h-3.5 text-indigo-600" />}
        >
          Add Friend by ID
        </Button>
      </div>

      {/* Real-time Socket Live Sync Banner */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-4 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl" />
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isConnected ? "bg-emerald-400 animate-pulse" : "bg-amber-400"
            }`}
          />
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            {isConnected ? "Real-time Live Sync" : "Connecting to Socket..."}
          </h4>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          Posts, comments, and notification alerts are delivered instantly using active WebSockets.
        </p>
      </div>

      {/* Privacy Tip Card */}
      <div className="bg-indigo-50/50 rounded-2xl p-4 border border-indigo-100 text-xs">
        <div className="flex items-center gap-2 text-indigo-900 font-semibold mb-1">
          <ShieldCheckIcon className="w-4 h-4 text-indigo-600" />
          <span>Privacy First</span>
        </div>
        <p className="text-slate-600 leading-relaxed mb-2 text-[11px]">
          Control who sees your posts. Choose between Public, Friends Only, or Private anytime.
        </p>
        <button
          type="button"
          onClick={onOpenPrivacy}
          className="text-indigo-600 hover:text-indigo-700 font-semibold hover:underline cursor-pointer"
        >
          View Privacy Guide →
        </button>
      </div>

      {/* Footer Info */}
      <div className="mt-auto px-1 text-[11px] text-slate-400 space-y-1">
        <p>© 2026 Nexus Social Network. Internship Project.</p>
        <div className="flex gap-2">
          <button
            onClick={onOpenPrivacy}
            className="hover:underline cursor-pointer"
          >
            Privacy
          </button>
          <span>•</span>
          <a
            href={import.meta.env.VITE_API_URL || "http://localhost:5000"}
            target="_blank"
            rel="noreferrer"
            className="hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>API Server</span>
          </a>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;

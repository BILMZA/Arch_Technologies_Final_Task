import { useSocket } from "../../context/SocketContext";
import Avatar from "./Avatar";
import { XIcon, HeartIcon, MessageCircleIcon, UserPlusIcon, CheckIcon, BellIcon } from "./Icons";

export const ToastContainer = () => {
  const { toasts, removeToast } = useSocket();

  if (!toasts || toasts.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case "like":
        return <HeartIcon className="w-4 h-4 text-rose-500" filled />;
      case "comment":
        return <MessageCircleIcon className="w-4 h-4 text-indigo-500" />;
      case "friend_request":
        return <UserPlusIcon className="w-4 h-4 text-blue-500" />;
      case "friend_accept":
        return <CheckIcon className="w-4 h-4 text-emerald-500" />;
      default:
        return <BellIcon className="w-4 h-4 text-indigo-500" />;
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-xl p-3.5 shadow-xl border border-slate-200/80 flex items-start gap-3 transform transition-all duration-200 animate-fade-in hover:shadow-2xl"
        >
          {toast.avatar ? (
            <Avatar src={toast.avatar} name={toast.name || "User"} size="sm" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0">
              {getIcon(toast.type)}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-semibold text-slate-900 tracking-tight">
              {toast.title}
            </h4>
            <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-md transition-colors"
          >
            <XIcon className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;

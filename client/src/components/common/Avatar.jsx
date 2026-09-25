import { useState } from "react";
import { getMediaUrl } from "../../services/api";

const sizeClasses = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-16 h-16 text-lg",
  "2xl": "w-24 h-24 text-2xl font-bold",
};

// Generates consistent pleasant background gradients based on string
const getAvatarGradient = (name = "") => {
  const gradients = [
    "from-indigo-500 to-purple-600",
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
    "from-violet-500 to-fuchsia-600",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % gradients.length;
  return gradients[index];
};

const getInitials = (name = "") => {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const Avatar = ({
  src,
  name = "User",
  size = "md",
  className = "",
  showStatus = false,
  isOnline = false,
  onClick,
}) => {
  const [hasError, setHasError] = useState(false);
  const imageUrl = src ? getMediaUrl(src) : null;
  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const gradient = getAvatarGradient(name);
  const initials = getInitials(name);

  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full select-none ${
        onClick ? "cursor-pointer hover:opacity-90 transition-opacity" : ""
      } ${className}`}
    >
      {imageUrl && !hasError ? (
        <img
          src={imageUrl}
          alt={name}
          onError={() => setHasError(true)}
          className={`${sizeClass} rounded-full object-cover ring-2 ring-white shadow-xs`}
        />
      ) : (
        <div
          className={`${sizeClass} rounded-full bg-gradient-to-tr ${gradient} text-white font-semibold flex items-center justify-center ring-2 ring-white shadow-xs`}
        >
          {initials}
        </div>
      )}

      {showStatus && (
        <span
          className={`absolute bottom-0 right-0 block rounded-full ring-2 ring-white ${
            size === "xs" || size === "sm" ? "w-2 h-2" : "w-3 h-3"
          } ${isOnline ? "bg-emerald-500" : "bg-slate-300"}`}
        />
      )}
    </div>
  );
};

export default Avatar;

import { GlobeIcon, UsersIcon, LockIcon } from "./Icons";

export const PrivacyBadge = ({ privacy = "public", size = "sm" }) => {
  const configs = {
    public: {
      label: "Public",
      icon: <GlobeIcon className="w-3 h-3 text-emerald-600" />,
      bg: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
    },
    friends: {
      label: "Friends",
      icon: <UsersIcon className="w-3 h-3 text-indigo-600" />,
      bg: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
    },
    private: {
      label: "Only Me",
      icon: <LockIcon className="w-3 h-3 text-amber-600" />,
      bg: "bg-amber-50 text-amber-700 border-amber-200/80",
    },
  };

  const config = configs[privacy] || configs.public;

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium border rounded-full select-none ${
        size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-xs"
      } ${config.bg}`}
    >
      {config.icon}
      <span>{config.label}</span>
    </span>
  );
};

export const Badge = ({
  children,
  variant = "indigo",
  size = "sm",
  dot = false,
  className = "",
}) => {
  const variants = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-200",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    amber: "bg-amber-50 text-amber-700 border-amber-200",
    rose: "bg-rose-50 text-rose-700 border-rose-200",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
  };

  const dotColors = {
    indigo: "bg-indigo-500",
    emerald: "bg-emerald-500",
    amber: "bg-amber-500",
    rose: "bg-rose-500",
    slate: "bg-slate-500",
  };

  const variantClass = variants[variant] || variants.indigo;
  const dotColor = dotColors[variant] || dotColors.indigo;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-full select-none ${
        size === "xs" ? "px-1.5 py-0.5 text-[10px]" : "px-2.5 py-0.5 text-xs"
      } ${variantClass} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {children}
    </span>
  );
};

export default Badge;

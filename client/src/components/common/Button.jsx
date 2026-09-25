
const variants = {
  primary:
    "bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow-indigo-500/25 border border-transparent focus:ring-indigo-500",
  secondary:
    "bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200/80 focus:ring-slate-400",
  outline:
    "bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 shadow-xs focus:ring-indigo-500",
  ghost:
    "bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-transparent focus:ring-slate-300",
  danger:
    "bg-rose-600 hover:bg-rose-700 text-white shadow-xs hover:shadow-rose-500/25 border border-transparent focus:ring-rose-500",
  success:
    "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs hover:shadow-emerald-500/25 border border-transparent focus:ring-emerald-500",
};

const sizes = {
  xs: "px-2.5 py-1 text-xs rounded-md gap-1.5",
  sm: "px-3 py-1.5 text-xs font-medium rounded-lg gap-1.5",
  md: "px-4 py-2 text-sm font-medium rounded-xl gap-2",
  lg: "px-5 py-2.5 text-base font-medium rounded-xl gap-2.5",
};

export const Button = ({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className = "",
  isLoading = false,
  disabled = false,
  icon = null,
  onClick,
  ...props
}) => {
  const variantClass = variants[variant] || variants.primary;
  const sizeClass = sizes[size] || sizes.md;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`inline-flex items-center justify-center font-medium cursor-pointer transition-all duration-150 select-none outline-none focus:ring-2 focus:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 ${variantClass} ${sizeClass} ${className}`}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
};

export default Button;

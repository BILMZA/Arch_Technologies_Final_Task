import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "./Icons";

export const Input = ({
  label,
  error,
  helperText,
  icon,
  type = "text",
  name,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  className = "",
  containerClassName = "",
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const actualType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label className="text-sm font-medium text-slate-700 flex items-center justify-between">
          <span>
            {label} {required && <span className="text-rose-500">*</span>}
          </span>
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center">
            {icon}
          </div>
        )}

        <input
          type={actualType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={`w-full bg-white text-slate-900 placeholder:text-slate-400 text-sm rounded-xl border transition-all duration-150 outline-none ${
            icon ? "pl-10" : "pl-3.5"
          } ${isPassword ? "pr-10" : "pr-3.5"} py-2.5 ${
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
              : "border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          } disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed ${className}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 text-slate-400 hover:text-slate-600 focus:outline-none p-1"
          >
            {showPassword ? (
              <EyeOffIcon className="w-4 h-4" />
            ) : (
              <EyeIcon className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {error ? (
        <p className="text-xs text-rose-500 mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-400 mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
};

export default Input;

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import Input from "../components/common/Input";
import Button from "../components/common/Button";
import {
  SparklesIcon,
  GlobeIcon,
  ShieldCheckIcon,
  UsersIcon,
  CheckIcon,
} from "../components/common/Icons";

export const AuthPage = () => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"); // 'login' | 'register'

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (mode === "register") {
      if (!name.trim()) {
        setErrorMessage("Please enter your name");
        return;
      }
      if (password.length < 6) {
        setErrorMessage("Password must be at least 6 characters");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Passwords do not match");
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === "login") {
        await login({ email: email.trim(), password });
      } else {
        await register({
          name: name.trim(),
          email: email.trim(),
          password,
        });
        setSuccessMessage("Account created successfully! You can now log in.");
        setMode("login");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setErrorMessage(
        err.response?.data?.message ||
          "Could not connect to server. Please ensure the backend is running."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">
        {/* Left Branding / Value Proposition Column */}
        <div className="lg:col-span-5 bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-800 text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 bg-violet-400/20 rounded-full blur-2xl pointer-events-none" />

          {/* Brand header */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 mb-6 text-xs font-semibold">
              <SparklesIcon className="w-4 h-4 text-indigo-200" />
              <span>Internship Capstone Project</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Welcome to Nexus.
            </h1>
            <p className="mt-3 text-indigo-100/90 text-sm leading-relaxed">
              A modern, privacy-first social platform designed for seamless sharing, real-time community engagement, and rich media stories.
            </p>
          </div>

          {/* Feature List */}
          <div className="relative z-10 my-8 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <GlobeIcon className="w-4 h-4 text-indigo-200" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  Real-time Updates
                </h4>
                <p className="text-[11px] text-indigo-200 leading-normal">
                  Live feeds, comment threads, and instant notification alerts with Socket.IO.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <ShieldCheckIcon className="w-4 h-4 text-indigo-200" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  Granular Privacy
                </h4>
                <p className="text-[11px] text-indigo-200 leading-normal">
                  Publish publicly, exclusively to friends, or privately to your own personal vault.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                <UsersIcon className="w-4 h-4 text-indigo-200" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">
                  Community Connections
                </h4>
                <p className="text-[11px] text-indigo-200 leading-normal">
                  Send connection requests, manage mutual friends, and build your social circle.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="relative z-10 text-[11px] text-indigo-200/80 pt-4 border-t border-white/10">
            Powered by Node.js, Express, MongoDB, Socket.IO & React Vite.
          </div>
        </div>

        {/* Right Form Column */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            {/* Mode Switcher Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl mb-6">
              <button
                type="button"
                onClick={() => switchMode("login")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === "login"
                    ? "bg-white text-indigo-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  mode === "register"
                    ? "bg-white text-indigo-600 shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Create Account
              </button>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-bold text-slate-900">
                {mode === "login"
                  ? "Sign in to your account"
                  : "Join the Nexus community"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {mode === "login"
                  ? "Enter your credentials below to access your feed and updates."
                  : "Create an account to start sharing posts and connecting with friends."}
              </p>
            </div>

            {/* Error & Success Feedback */}
            {errorMessage && (
              <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
                {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-medium flex items-center gap-2">
                <CheckIcon className="w-4 h-4 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <Input
                  label="Full Name"
                  placeholder="e.g. Alex Morgan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}

              <Input
                label="Email Address"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                helperText={
                  mode === "register" ? "Minimum 6 characters" : undefined
                }
              />

              {mode === "register" && (
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isLoading}
                className="w-full mt-2 py-3 shadow-md shadow-indigo-600/20"
              >
                {mode === "login" ? "Sign In" : "Create Free Account"}
              </Button>
            </form>

            {/* Footer toggle prompt */}
            <div className="text-center mt-6 pt-6 border-t border-slate-100">
              <p className="text-xs text-slate-500">
                {mode === "login"
                  ? "Don't have an account yet?"
                  : "Already registered?"}{" "}
                <button
                  type="button"
                  onClick={() =>
                    switchMode(mode === "login" ? "register" : "login")
                  }
                  className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline cursor-pointer"
                >
                  {mode === "login" ? "Sign up here" : "Log in here"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

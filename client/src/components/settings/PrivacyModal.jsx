import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import Modal from "../common/Modal";
import Button from "../common/Button";
import {
  GlobeIcon,
  UsersIcon,
  LockIcon,
  ShieldCheckIcon,
  CheckIcon,
} from "../common/Icons";

export const PrivacyModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    if (user?.id) {
      navigator.clipboard?.writeText(user.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Privacy & Community Settings"
      subtitle="Understand how your content and profile privacy works on Nexus"
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        {/* Your Account Identity Card */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Your Nexus User ID
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              className="text-xs text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer inline-flex items-center gap-1"
            >
              {copied ? (
                <>
                  <CheckIcon className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">Copied!</span>
                </>
              ) : (
                <span>Copy ID for Friends</span>
              )}
            </button>
          </div>
          <code className="text-xs font-mono bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-800 block select-all">
            {user?.id || "N/A"}
          </code>
          <p className="text-[11px] text-slate-400 mt-2">
            Share this ID with friends so they can send you direct connection requests.
          </p>
        </div>

        {/* Privacy Levels Explained */}
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Post Visibility Levels
          </h4>

          {/* Public */}
          <div className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 transition-colors flex items-start gap-3 bg-white">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
              <GlobeIcon className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">Public</h5>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Anyone on the Nexus platform can see this post in the global feed. Ideal for news, creative work, and community discussions.
              </p>
            </div>
          </div>

          {/* Friends */}
          <div className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 transition-colors flex items-start gap-3 bg-white">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 mt-0.5">
              <UsersIcon className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">Friends Only</h5>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Only users who are your confirmed mutual friends can see this post. Keeps personal updates restricted to your network.
              </p>
            </div>
          </div>

          {/* Private */}
          <div className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 transition-colors flex items-start gap-3 bg-white">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
              <LockIcon className="w-4 h-4" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-900">Only Me (Private)</h5>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                Only you have access to view this post. Perfect for draft thoughts, bookmarks, and private journal entries.
              </p>
            </div>
          </div>
        </div>

        {/* Security Summary */}
        <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-center gap-2.5 text-xs text-indigo-900">
          <ShieldCheckIcon className="w-5 h-5 text-indigo-600 shrink-0" />
          <span>
            All API communications are protected via JWT authentication and scoped database queries.
          </span>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <Button variant="primary" size="sm" onClick={onClose}>
            Got it
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default PrivacyModal;

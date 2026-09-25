import { useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import postService from "../../services/postService";
import Avatar from "../common/Avatar";
import Button from "../common/Button";
import {
  ImageIcon,
  VideoIcon,
  GlobeIcon,
  UsersIcon,
  LockIcon,
  XIcon,
  SparklesIcon,
} from "../common/Icons";

const privacyOptions = [
  { id: "public", label: "Public", icon: <GlobeIcon className="w-3.5 h-3.5" /> },
  { id: "friends", label: "Friends Only", icon: <UsersIcon className="w-3.5 h-3.5" /> },
  { id: "private", label: "Only Me", icon: <LockIcon className="w-3.5 h-3.5" /> },
];

export const PostComposer = ({ onPostCreated }) => {
  const { user } = useAuth();
  const [content, setContent] = useState("");
  const [privacy, setPrivacy] = useState("public");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(""); // 'image' or 'video'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size: 50MB max
    if (file.size > 50 * 1024 * 1024) {
      setError("File size exceeds 50MB limit");
      return;
    }

    setError("");
    setMediaFile(file);

    const isVideo = file.type.startsWith("video/");
    setMediaType(isVideo ? "video" : "image");

    const objectUrl = URL.createObjectURL(file);
    setMediaPreview(objectUrl);
  };

  const removeMedia = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !mediaFile) return;

    setIsLoading(true);
    setError("");

    try {
      const result = await postService.createPost({
        content: content.trim(),
        privacy,
        mediaFile,
      });

      // Clear fields
      setContent("");
      removeMedia();
      setIsPrivacyOpen(false);

      if (onPostCreated && result.post) {
        onPostCreated(result.post);
      }
    } catch (err) {
      console.error("Post creation error:", err);
      setError(
        err.response?.data?.message || "Failed to create post. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const activePrivacy = privacyOptions.find((p) => p.id === privacy) || privacyOptions[0];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs mb-6 transition-all duration-200 hover:border-slate-300">
      <form onSubmit={handleSubmit}>
        {/* Top bar: user info + privacy selector */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <Avatar
              src={user?.profilePicture}
              name={user?.name || "User"}
              size="md"
            />
            <div>
              <h4 className="text-sm font-semibold text-slate-900 leading-tight">
                {user?.name || "User"}
              </h4>
              
              {/* Privacy selector pill dropdown */}
              <div className="relative inline-block mt-0.5">
                <button
                  type="button"
                  onClick={() => setIsPrivacyOpen(!isPrivacyOpen)}
                  className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200/60"
                >
                  {activePrivacy.icon}
                  <span>{activePrivacy.label}</span>
                  <svg
                    className={`w-3 h-3 text-slate-500 transition-transform ${
                      isPrivacyOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isPrivacyOpen && (
                  <div className="absolute left-0 mt-1 w-40 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-20 animate-fade-in">
                    {privacyOptions.map((opt) => (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => {
                          setPrivacy(opt.id);
                          setIsPrivacyOpen(false);
                        }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-left hover:bg-slate-50 transition-colors ${
                          privacy === opt.id
                            ? "text-indigo-600 bg-indigo-50/50"
                            : "text-slate-700"
                        }`}
                      >
                        {opt.icon}
                        <span>{opt.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center text-xs text-indigo-600 font-medium gap-1 bg-indigo-50/60 px-2.5 py-1 rounded-full border border-indigo-100">
            <SparklesIcon className="w-3.5 h-3.5" />
            <span>Share with community</span>
          </div>
        </div>

        {/* Text Area */}
        <div className="my-2">
          <textarea
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`What's happening, ${user?.name ? user.name.split(" ")[0] : "friend"}?`}
            className="w-full text-slate-900 placeholder:text-slate-400 text-sm sm:text-base border-none resize-none outline-none focus:ring-0 p-1"
          />
        </div>

        {/* Media Preview Box */}
        {mediaPreview && (
          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950 mb-3 max-h-80 group">
            {mediaType === "video" ? (
              <video
                src={mediaPreview}
                controls
                className="w-full max-h-80 object-contain mx-auto"
              />
            ) : (
              <img
                src={mediaPreview}
                alt="Upload preview"
                className="w-full max-h-80 object-contain mx-auto"
              />
            )}

            <button
              type="button"
              onClick={removeMedia}
              className="absolute top-2.5 right-2.5 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full p-1.5 transition-colors shadow-md backdrop-blur-xs cursor-pointer"
            >
              <XIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mb-3 px-3 py-2 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-600">
            {error}
          </div>
        )}

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*,video/*"
              className="hidden"
            />

            <button
              type="button"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = "image/*";
                  fileInputRef.current.click();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-emerald-500" />
              <span>Photo</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (fileInputRef.current) {
                  fileInputRef.current.accept = "video/*";
                  fileInputRef.current.click();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
            >
              <VideoIcon className="w-4 h-4 text-rose-500" />
              <span>Video</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {content.length > 0 && (
              <span className="text-xs text-slate-400 font-mono">
                {content.length}/5000
              </span>
            )}

            <Button
              type="submit"
              size="sm"
              variant="primary"
              isLoading={isLoading}
              disabled={!content.trim() && !mediaFile}
            >
              Publish Post
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostComposer;

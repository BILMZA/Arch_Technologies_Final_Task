import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import userService from "../../services/userService";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";

export const EditProfileModal = ({ isOpen, onClose, onProfileUpdated }) => {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user && isOpen) {
      setName(user.name || "");
      setBio(user.bio || "");
      setError("");
      setSuccess("");
    }
  }, [user, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Name cannot be empty");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await userService.updateProfile({
        name: name.trim(),
        bio: bio.trim(),
      });

      if (res.user) {
        updateUser(res.user);
        onProfileUpdated?.(res.user);
        setSuccess("Profile updated successfully!");
        setTimeout(() => {
          onClose();
        }, 800);
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      setError(
        err.response?.data?.message || "Failed to update profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      subtitle="Update your public profile information"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs">
            {success}
          </div>
        )}

        <Input
          label="Display Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          required
        />

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700">Bio</label>
          <textarea
            rows={4}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell the community a little about yourself, what you're building, or your interests..."
            className="w-full bg-white text-slate-900 placeholder:text-slate-400 text-sm rounded-xl border border-slate-200 hover:border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 p-3 outline-none transition-all resize-none"
          />
          <p className="text-xs text-slate-400 text-right">
            {bio.length} / 500 characters
          </p>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            isLoading={isLoading}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EditProfileModal;

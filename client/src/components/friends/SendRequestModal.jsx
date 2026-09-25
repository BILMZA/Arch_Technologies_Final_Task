import { useState } from "react";
import friendService from "../../services/friendService";
import Modal from "../common/Modal";
import Input from "../common/Input";
import Button from "../common/Button";
import { UserPlusIcon, CheckIcon } from "../common/Icons";

export const SendRequestModal = ({ isOpen, onClose, onRequestSent }) => {
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId.trim()) {
      setError("Please provide a valid User ID");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await friendService.sendFriendRequest(userId.trim());
      setSuccess(res.message || "Friend request sent successfully!");
      onRequestSent?.(res.request);
      setUserId("");
      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 1200);
    } catch (err) {
      console.error("Failed to send friend request:", err);
      setError(
        err.response?.data?.message || "Failed to send friend request. Check the User ID."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Connect with a Friend"
      subtitle="Send a connection request to any user on Nexus"
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs flex items-center gap-2">
            <CheckIcon className="w-4 h-4 text-emerald-600" />
            <span>{success}</span>
          </div>
        )}

        <Input
          label="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder="e.g. 64b281f9a21e..."
          helperText="You can find the User ID on their profile or by clicking on author details."
          required
        />

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
            icon={<UserPlusIcon className="w-4 h-4" />}
          >
            Send Request
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default SendRequestModal;

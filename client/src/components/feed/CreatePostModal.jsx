import Modal from "../common/Modal";
import PostComposer from "./PostComposer";

export const CreatePostModal = ({ isOpen, onClose, onPostCreated }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Post"
      subtitle="Share an update, photo, or video with your network"
      maxWidth="max-w-xl"
    >
      <PostComposer
        onPostCreated={(post) => {
          onPostCreated?.(post);
          onClose();
        }}
      />
    </Modal>
  );
};

export default CreatePostModal;

import api from "./api";

export const postService = {
  async getPosts() {
    const response = await api.get("/api/posts");
    return response.data;
  },

  async createPost({ content, privacy = "public", mediaFile = null }) {
    const formData = new FormData();
    if (content) {
      formData.append("content", content);
    }
    if (privacy) {
      formData.append("privacy", privacy);
    }
    if (mediaFile) {
      formData.append("media", mediaFile);
    }

    const response = await api.post("/api/posts", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async likePost(postId) {
    const response = await api.post(`/api/posts/${postId}/like`);
    return response.data;
  },
};

export default postService;

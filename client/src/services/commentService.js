import api from "./api";

export const commentService = {
  async getComments(postId) {
    const response = await api.get(`/api/comments/${postId}`);
    return response.data;
  },

  async createComment(postId, content) {
    const response = await api.post(`/api/comments/${postId}`, {
      content,
    });
    return response.data;
  },
};

export default commentService;

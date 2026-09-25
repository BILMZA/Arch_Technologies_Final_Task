import api from "./api";

export const friendService = {
  async getPendingRequests() {
    const response = await api.get("/api/friend-requests/pending");
    return response.data;
  },

  async sendFriendRequest(userId) {
    const response = await api.post(`/api/friend-requests/${userId}`);
    return response.data;
  },

  async acceptFriendRequest(requestId) {
    const response = await api.post(`/api/friend-requests/${requestId}/accept`);
    return response.data;
  },

  async rejectFriendRequest(requestId) {
    const response = await api.post(`/api/friend-requests/${requestId}/reject`);
    return response.data;
  },
};

export default friendService;

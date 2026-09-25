import api from "./api";

export const notificationService = {
  async getNotifications() {
    const response = await api.get("/api/notifications");
    return response.data;
  },

  async markAsRead(notificationId) {
    const response = await api.put(`/api/notifications/${notificationId}/read`);
    return response.data;
  },
};

export default notificationService;

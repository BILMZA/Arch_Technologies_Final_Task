import api from "./api";

export const userService = {
  async getProfile(userId) {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  },

  async updateProfile({ name, bio }) {
    const response = await api.put("/api/users/profile", {
      name,
      bio,
    });
    return response.data;
  },
};

export default userService;

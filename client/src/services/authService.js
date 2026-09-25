import api from "./api";

export const authService = {
  async register({ name, email, password }) {
    const response = await api.post("/api/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  },

  async login({ email, password }) {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });
    return response.data;
  },
};

export default authService;

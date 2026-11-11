import { request } from "./apiClient";

export const authService = {
  async login({ email, password }) {
    return request("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
  },

  async loginWithGoogle(credential) {
    return request("/auth/google", { method: "POST", body: JSON.stringify({ credential }) });
  },

  async register(profile) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email: profile.correo, password: profile.password }),
    });
  },

  async me() { return request("/auth/me"); },
  async logout() { return request("/auth/logout", { method: "POST" }); },
};

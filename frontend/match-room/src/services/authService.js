import { request } from "./apiClient";

// The backend stores the session in an httpOnly cookie, so every call relies on
// `credentials: "include"` from apiClient instead of sending a bearer token.
export const authService = {
  async login({ email, password }) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  },

  async loginWithGoogle(credential, linkPassword) {
    return request("/auth/google", {
      method: "POST",
      body: JSON.stringify(linkPassword ? { credential, linkPassword } : { credential }),
    });
  },

  async register({ correo, password, terminos }) {
    return request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: correo,
        password,
        acceptTerms: Boolean(terminos),
        adultDeclared: Boolean(terminos),
      }),
    });
  },

  async me() { return request("/auth/me"); },

  // The session cookie is also the refresh token. Rotating it invalidates the
  // previous cookie, which is why the response must be the new session.
  async refresh() { return request("/auth/refresh", { method: "POST" }); },

  async logout() { return request("/auth/logout", { method: "POST" }); },
  async logoutAll() { return request("/auth/logout-all", { method: "POST" }); },

  async verifyEmail(token) {
    return request("/auth/email/verify", {
      method: "POST",
      body: JSON.stringify({ token }),
    });
  },

  async resendVerification() {
    return request("/auth/email/resend", { method: "POST" });
  },

  async forgotPassword(email) {
    return request("/auth/password/forgot", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
  },

  async resetPassword(token, newPassword) {
    return request("/auth/password/reset", {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    });
  },

  async changePassword(currentPassword, newPassword) {
    return request("/auth/password", {
      method: "PATCH",
      body: JSON.stringify({ currentPassword, newPassword }),
      errorMessages: { 401: "Tu contraseña actual no es correcta." },
    });
  },

  // Used when a session already exists (for example after signing in with
  // Google) and the person still has to accept the terms.
  async acceptLegal({ acceptTerms = true, adultDeclared = true } = {}) {
    return request("/auth/legal/accept", {
      method: "POST",
      body: JSON.stringify({ acceptTerms, adultDeclared }),
    });
  },

  async updateMode(mode) {
    return request("/auth/me/mode", {
      method: "PATCH",
      body: JSON.stringify({ mode }),
      errorMessages: { 403: "Tu cuenta todavía no puede publicar anuncios." },
    });
  },

  async enableLandlord() {
    return request("/auth/me/landlord", {
      method: "POST",
      errorMessages: { 403: "Necesitas verificar tu identidad para publicar anuncios." },
    });
  },

  async deleteAccount(payload) {
    return request("/auth/me", {
      method: "DELETE",
      body: JSON.stringify(payload),
      errorMessages: { 401: "No pudimos confirmar tu contraseña." },
    });
  },
};

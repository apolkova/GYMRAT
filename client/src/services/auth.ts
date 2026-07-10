import api from "./api";
import type { AuthUser } from "../types/auth";

export type MeResponse = {
  user: AuthUser;
};

export async function getCurrentUser() {
  const response = await api.get<MeResponse>("/auth/me");
  return response.data.user;
}

export function getStoredToken() {
  return localStorage.getItem("gymrat_token");
}

export function clearAuthStorage() {
  localStorage.removeItem("gymrat_token");
  localStorage.removeItem("gymrat_user");
}
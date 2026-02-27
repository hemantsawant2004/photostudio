import { api } from "./client";
import type { AuthResponse, AuthUser, LoginPayload, SignupPayload } from "../types/auth";

export const AuthApi = {
  async signup(payload: SignupPayload): Promise<AuthResponse> {
    const res = await api.post("/auth/signup", payload);
    return res.data.data;
  },

  async login(payload: LoginPayload): Promise<AuthResponse> {
    const res = await api.post("/auth/login", payload);
    return res.data.data;
  },

  async me(token: string): Promise<AuthUser> {
    const res = await api.get("/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.data;
  },
};

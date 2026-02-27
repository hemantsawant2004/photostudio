export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload extends LoginPayload {
  name: string;
}

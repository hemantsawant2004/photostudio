import type { AuthUser } from "../../types/auth";

export type AuthMode = "login" | "signup";

export type AuthFormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export type AuthState = {
  user: AuthUser | null;
  token: string | null;
  mode: AuthMode;
  form: AuthFormState;
  error: string | null;
  status: string | null;
  isSubmitting: boolean;
  isCheckingSession: boolean;
};

export type AuthSubmitResult = boolean;

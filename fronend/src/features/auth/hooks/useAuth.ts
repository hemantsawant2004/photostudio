import { useEffect, useState } from "react";
import { AuthApi } from "../../../api/auth";
import type { AuthResponse } from "../../../types/auth";
import type { AuthFormState, AuthMode, AuthState, AuthSubmitResult } from "../types";

const AUTH_STORAGE_KEY = "photostudio-auth-token";

const initialForm: AuthFormState = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function readStoredToken(): string | null {
  return window.localStorage.getItem(AUTH_STORAGE_KEY);
}

function storeAuthSession(result: AuthResponse) {
  window.localStorage.setItem(AUTH_STORAGE_KEY, result.token);
}

function clearAuthSession() {
  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function useAuth() {
  const [state, setState] = useState<AuthState>(() => {
    const token = readStoredToken();

    return {
      user: null,
      token,
      mode: "login",
      form: initialForm,
      error: null,
      status: null,
      isSubmitting: false,
      isCheckingSession: Boolean(token),
    };
  });
  const token = state.token;

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadSession = async () => {
      try {
        const user = await AuthApi.me(token);
        setState((current) => ({
          ...current,
          user,
          token,
          status: "Session restored.",
          isCheckingSession: false,
        }));
      } catch {
        clearAuthSession();
        setState((current) => ({
          ...current,
          token: null,
          user: null,
          isCheckingSession: false,
        }));
      }
    };

    void loadSession();
  }, [token]);

  const setMode = (mode: AuthMode) => {
    setState((current) => ({
      ...current,
      mode,
      error: null,
      status: null,
      form: initialForm,
    }));
  };

  const updateField = (field: keyof AuthFormState, value: string) => {
    setState((current) => ({
      ...current,
      form: {
        ...current.form,
        [field]: value,
      },
    }));
  };

  const submit = async (): Promise<AuthSubmitResult> => {
    setState((current) => ({
      ...current,
      error: null,
      status: null,
      isSubmitting: true,
    }));

    if (state.mode === "signup" && state.form.password !== state.form.confirmPassword) {
      setState((current) => ({
        ...current,
        error: "Passwords do not match.",
        isSubmitting: false,
      }));
      return false;
    }

    try {
      const payload = {
        name: state.form.name,
        email: state.form.email,
        password: state.form.password,
      };
      const result =
        state.mode === "signup"
          ? await AuthApi.signup(payload)
          : await AuthApi.login({
              email: payload.email,
              password: payload.password,
            });

      storeAuthSession(result);

      setState((current) => ({
        ...current,
        user: result.user,
        token: result.token,
        form: initialForm,
        status:
          state.mode === "signup"
            ? "Account created and signed in."
            : "Signed in successfully.",
        isSubmitting: false,
      }));
      return true;
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        typeof error.response === "object" &&
        error.response !== null &&
        "data" in error.response &&
        typeof error.response.data === "object" &&
        error.response.data !== null &&
        "message" in error.response.data &&
        typeof error.response.data.message === "string"
          ? error.response.data.message
          : "Authentication failed.";

      setState((current) => ({
        ...current,
        error: message,
        isSubmitting: false,
      }));
      return false;
    }
  };

  const logout = () => {
    clearAuthSession();
    setState((current) => ({
      ...current,
      user: null,
      token: null,
      form: initialForm,
      error: null,
      status: "Signed out.",
    }));
  };

  return {
    ...state,
    setMode,
    updateField,
    submit,
    logout,
  };
}

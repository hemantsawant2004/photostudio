import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../../models/user";
import { env } from "../../config/env";
import type { LoginInput, SignupInput } from "./auth.schema";

type AuthResponse = {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
  };
};

function signToken(user: User): string {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
    },
    env.jwtSecret,
    { expiresIn: "7d" },
  );
}

function toAuthResponse(user: User): AuthResponse {
  return {
    token: signToken(user),
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
}

export const AuthService = {
  async signup(data: SignupInput): Promise<AuthResponse> {
    const existingUser = await User.findOne({
      where: { email: data.email.toLowerCase() },
    });

    if (existingUser) {
      const error = new Error("Email already registered");
      (error as Error & { status?: number }).status = 409;
      throw error;
    }

    const password = await bcrypt.hash(data.password, 10);
    const user = await User.create({
      name: data.name.trim(),
      email: data.email.toLowerCase(),
      password,
      role: "USER",
    });

    return toAuthResponse(user);
  },

  async login(data: LoginInput): Promise<AuthResponse> {
    const user = await User.findOne({
      where: { email: data.email.toLowerCase() },
    });

    if (!user) {
      const error = new Error("Invalid email or password");
      (error as Error & { status?: number }).status = 401;
      throw error;
    }

    const validPassword = await bcrypt.compare(data.password, user.password);
    if (!validPassword) {
      const error = new Error("Invalid email or password");
      (error as Error & { status?: number }).status = 401;
      throw error;
    }

    return toAuthResponse(user);
  },

  getCurrentUser(user: User): AuthResponse["user"] {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },
};

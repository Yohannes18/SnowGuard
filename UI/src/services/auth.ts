import { api } from "./api";
import type { AxiosResponse } from "axios";

export interface User {
  id: string;
  email: string;
  username: string;
  role?: string;
}

export interface LoginPayload {
  username: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type?: string;
}

// Login User
export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const res: AxiosResponse<LoginResponse> = await api.post("/auth/token", payload);
  return res.data;
}

// Register User
export async function registerUser(payload: RegisterPayload): Promise<User> {
  const res: AxiosResponse<User> = await api.post("/auth/register", payload);
  return res.data;
}

// Get Current User (uses api interceptor for token)
export async function getCurrentUser(): Promise<User> {
  const res: AxiosResponse<User> = await api.get("/auth/me");
  return res.data;
}

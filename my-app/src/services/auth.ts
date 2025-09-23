import axios, { type AxiosResponse } from "axios";

// Axios instance
const API = axios.create({
  baseURL: "http://127.0.0.1:8000", // fixed
  headers: { "Content-Type": "application/json" },
});

// --- Types ---
export interface User {
  id: string;
  email: string;
  username: string;
  role?: string;
}

export interface LoginPayload {
  username: string;   // changed from email → username
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

// --- Auth functions ---

// Login User
export async function loginUser(payload: LoginPayload): Promise<LoginResponse> {
  const res: AxiosResponse<LoginResponse> = await API.post(
    "/auth/jwt/login",
    payload // now matches backend shape directly
  );
  return res.data;
}

// Register User
export async function registerUser(payload: RegisterPayload): Promise<User> {
  const res: AxiosResponse<User> = await API.post("/auth/register", payload);
  return res.data;
}

// Get Current User
export async function getCurrentUser(token: string): Promise<User> {
  const res: AxiosResponse<User> = await API.get("/users/users/me", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

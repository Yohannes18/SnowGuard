import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getCurrentUser } from "../services/auth";
import { setAuthToken } from "../services/api";
import Loader from "../components/Loader";

// --- Types ---
export interface User {
  id: string;
  email: string;
  username: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
  setUserState?: (user: User) => void;
}

// --- Context ---
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access_token")
  );
  const [loading, setLoading] = useState(true);

  // Auto-fetch user when token exists
  useEffect(() => {
    async function fetchUser() {
      if (token) {
        try {
          setAuthToken(token);
          const currentUser = await getCurrentUser();
          setUser(currentUser);
        } catch (err) {
          console.error("Failed to fetch user:", err);
          logout(); // if token invalid → clear it
        }
      }
      setLoading(false);
    }
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Login (store token + fetch user)
  const login = async (newToken: string) => {
    localStorage.setItem("access_token", newToken);
    setAuthToken(newToken);
    setToken(newToken);
    setLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      console.error("Failed to fetch user after login:", err);
      logout();
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setAuthToken(undefined);
    localStorage.removeItem("access_token");
    setToken(null);
    setUser(null);
  };

  const setUserState = (u: User) => setUser(u);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, setUserState }}>
      {loading ? <Loader /> : children}
    </AuthContext.Provider>
  );
}

// --- Hook ---
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

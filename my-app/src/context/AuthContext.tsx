import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { getCurrentUser } from "../services/auth";
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
    localStorage.getItem("token")
  );
  const [loading, setLoading] = useState(true);

  // Auto-fetch user when token exists
  useEffect(() => {
    async function fetchUser() {
      if (token) {
        try {
          const currentUser = await getCurrentUser(token);
          setUser(currentUser);
        } catch (err) {
          console.error("Failed to fetch user:", err);
          logout(); // if token invalid → clear it
        }
      }
      setLoading(false);
    }
    fetchUser();
  }, [token]);

  // Login (store token + fetch user)
  const login = async (token: string) => {
    localStorage.setItem("token", token);
    setToken(token);
    setLoading(true);
    try {
      const currentUser = await getCurrentUser(token);
      setUser(currentUser);
    } catch (err) {
      console.error("Failed to fetch user after login:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const setUserState = (user: User) => setUser(user);

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

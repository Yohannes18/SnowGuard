import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AdminRoute({ children }: Props) {
  const { token, user } = useAuth();

  if (!token) return <Navigate to="/login" replace />;
  if (user?.role !== "admin") return <Navigate to="/profile" replace />;

  return <>{children}</>;
}

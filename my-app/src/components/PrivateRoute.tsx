import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function PrivateRoute({ children }: Props) {
  const { token } = useAuth();
  return <>{token ? children : <Navigate to="/login" replace />}</>;
}

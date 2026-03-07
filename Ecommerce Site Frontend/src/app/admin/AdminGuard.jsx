import { Navigate } from "react-router-dom";

export const ADMIN_SESSION_KEY = "driport_admin_session";

export default function AdminGuard({ children }) {
  const isAuthed = localStorage.getItem(ADMIN_SESSION_KEY) === "true";
  if (!isAuthed) return <Navigate to="/admin/login" replace />;
  return children;
}


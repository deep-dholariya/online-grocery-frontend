import { Navigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useProfile();

  if (loading) return null; // optional spinner laga sakte ho

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin route but not admin
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
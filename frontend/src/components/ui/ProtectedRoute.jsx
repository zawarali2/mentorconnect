import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

/**
 * Wraps protected pages. Redirects to /mentor/login if no authenticated user.
 */
export default function ProtectedRoute({ children }) {
  const { user, authLoading } = useContext(AppContext);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#e07a5f] border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/mentor/login" replace />;
  }

  return children;
}

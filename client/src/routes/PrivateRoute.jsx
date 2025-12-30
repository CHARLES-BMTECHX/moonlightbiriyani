import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";

/**
 * A wrapper component for protected routes that enforces authentication and role-based access.
 * * @param {string[]} [allowedRoles] - An array of roles (e.g., ['admin', 'manager']) allowed to access the route.
 * If not provided, only checks for authentication.
 */
const PrivateRoute = ({ allowedRoles }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    // Return a loading state (e.g., a spinner or null) while we check the token
    return null;
  }

  // 1. Check Authentication
  if (!isAuthenticated) {
    // If not authenticated, redirect to login, preserving the attempted path in state for later redirection
    // toast.error("Please log in to view this page.");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check Authorization (Role)
  // Check if allowedRoles is provided AND the user's role is NOT in the allowed list
  const userRole = user?.role; // Assuming your user object has a 'role' property
  if (allowedRoles && !allowedRoles.includes(userRole)) {

    toast.warn("You do not have permission to access this page.");

    // Role-based Redirection (Crucial Step)
    if (userRole === 'admin') {
        // If an admin tries to access a restricted user page, send them to the Admin Dashboard
        return <Navigate to="/admin/dashboard" replace />;
    } else {
        // If a regular user tries to access a restricted admin page, send them to their account page
        return <Navigate to="/account" replace />;
    }
  }

  // 3. Authorized: Render the nested routes
  return <Outlet />;
};

export default PrivateRoute;

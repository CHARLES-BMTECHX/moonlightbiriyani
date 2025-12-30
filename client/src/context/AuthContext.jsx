import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // 🔄 Restore user on page refresh using token
  useEffect(() => {
    const restoreAuth = async () => {
      const token = localStorage.getItem("token");

      // No token → not logged in
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Call /auth/me (token-based)
        const data = await authService.getMe();
        setUser(data.user);
      } catch (error) {
        console.error("Auth restore failed:", error);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreAuth();
  }, []);

  // 🔐 Login
 const login = async (email, password) => {
    try {
      const data = await authService.login({ email, password });

      localStorage.setItem("token", data.token);
      setUser(data.user);

      // === NEW ROLE CHECK & REDIRECTION LOGIC ===
      if (data.user?.role === 'admin') {
        navigate("/admin/dashboard", { replace: true });
        toast.success(`Welcome back, Admin ${data.user.name || ''}!`);
      } else {
        // Default for user, manager, etc., or if the role field is missing
        navigate("/account", { replace: true }); // Redirect to a user-specific page
        toast.success(`Welcome back, ${data.user.name || ''}!`);
      }
      // =========================================

    } catch (error) {
      // Handle login error (e.g., toast.error(error.message))
      console.error("Login failed:", error);
    }
  };

  // 🆕 Signup
  const signup = async (userData) => {
    const data = await authService.signup(userData);
    localStorage.setItem("token", data.token);
    setUser(data.user);

    // Redirect logic after signup (assuming new users go to their account page)
    navigate("/account", { replace: true });

  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        signup,
        logout,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

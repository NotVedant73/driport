import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);

  // Check auth status on mount (client-side only)
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Listen to localStorage changes (for cross-tab sync)
  useEffect(() => {
    const handleStorageChange = () => {
      checkAuthStatus();
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const checkAuthStatus = () => {
    // ✅ Safely access localStorage (only on client)
    if (typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("driport_token");
      const email = localStorage.getItem("driport_email");
      const role = localStorage.getItem("driport_role");

      if (token && email) {
        setIsLoggedIn(true);
        setUserEmail(email);
        setUserRole(role || "");
      } else {
        setIsLoggedIn(false);
        setUserEmail("");
        setUserRole("");
      }
    } catch (error) {
      console.error("Error reading localStorage:", error);
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const login = (token, email, role) => {
    if (typeof window === 'undefined') return;  // ✅ Server-side safety

    try {
      localStorage.setItem("driport_token", token);
      localStorage.setItem("driport_email", email);
      localStorage.setItem("driport_role", role);
      setIsLoggedIn(true);
      setUserEmail(email);
      setUserRole(role);
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  };

  const logout = () => {
    if (typeof window === 'undefined') return;  // ✅ Server-side safety

    try {
      localStorage.removeItem("driport_token");
      localStorage.removeItem("driport_email");
      localStorage.removeItem("driport_role");
      setIsLoggedIn(false);
      setUserEmail("");
      setUserRole("");
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  };

  const value = {
    isLoggedIn,
    userEmail,
    userRole,
    loading,
    login,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

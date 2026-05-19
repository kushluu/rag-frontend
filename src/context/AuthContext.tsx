import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useRef, // 🔥 ADD THIS
} from "react";
import { getCurrentUser, logoutUser, refreshAccessToken } from "../api/auth";

type User = {
  id: number;
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const isChecking = useRef(false); // ✅ FIXED

  const checkAuth = async () => {
    if (isChecking.current) return;
    isChecking.current = true;

    try {
      const res = await getCurrentUser();

      if (res.success && res.data) {
        setUser(res.data);
        return;
      }

      const refreshRes = await refreshAccessToken();

      // 🔥 CRITICAL STOP
      if (!refreshRes.success) {
        setUser(null);
        return;
      }

      const meRes = await getCurrentUser();

      if (meRes.success && meRes.data) {
        setUser(meRes.data);
        return;
      }

      setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
      isChecking.current = false; // ✅ FIXED
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      window.location.href = "/";
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        checkAuth,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
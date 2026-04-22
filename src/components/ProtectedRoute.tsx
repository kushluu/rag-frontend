import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../api/auth";

export default function ProtectedRoute({ children }: any) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const res = await getCurrentUser();

      if (res.success) {
        setIsAuth(true);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!isAuth) return <Navigate to="/" />;

  return children;
}
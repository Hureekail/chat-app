import { Navigate, Outlet } from "react-router-dom";
import api from "../api";
import { useEffect, useState } from "react";

function ProtectedRoute() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        await api.get("/api/user/");
        if (isMounted) setAuthorized(true);
      } catch (e) {
        if (isMounted) setAuthorized(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    checkAuth();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return null;
  return authorized ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
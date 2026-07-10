import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { clearAuthStorage, getCurrentUser, getStoredToken } from "../services/auth";
import type { AuthUser } from "../types/auth";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    async function verifyUser() {
      const token = getStoredToken();

      if (!token) {
        setIsCheckingAuth(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        localStorage.setItem("gymrat_user", JSON.stringify(currentUser));
      } catch {
        clearAuthStorage();
      } finally {
        setIsCheckingAuth(false);
      }
    }

    verifyUser();
  }, []);

  if (isCheckingAuth) {
    return (
      <main>
        <p>Checking authentication...</p>
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
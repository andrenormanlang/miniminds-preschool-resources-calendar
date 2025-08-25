import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useAuthFetch } from "../utils/authUtils";
import Loading from "./Loading";

// API base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isSignedIn, isLoaded } = useUser();
  const { authFetch } = useAuthFetch();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const checkUserRole = async () => {
      if (isSignedIn) {
        try {
          const user = await authFetch(`${API_BASE_URL}/users/current`);
          console.log("PROTECTED ROUTE - Checking authorization:", {
            role: user.role,
            lowercaseRole: user.role.toLowerCase(),
            authorized:
              user.role === "superAdmin" ||
              user.role.toLowerCase() === "superadmin",
          });

          // Accept both 'superAdmin' and case-insensitive 'superadmin'
          setAuthorized(
            user.role === "superAdmin" ||
              user.role.toLowerCase() === "superadmin"
          );
        } catch (error) {
          console.error("Failed to check user role:", error);
          setAuthorized(false);
        }
      } else {
        setAuthorized(false);
      }
    };

    if (isLoaded) {
      checkUserRole();
    }
  }, [isSignedIn, isLoaded, authFetch]);

  if (!isLoaded || authorized === null) {
    return <Loading />;
  }

  if (!authorized) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

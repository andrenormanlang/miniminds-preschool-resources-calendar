import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import Loading from "./Loading";

type ProtectedRouteProps = {
  children: React.ReactNode;
  requiredRole?: string;
};

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isLoaded, isSignedIn, user } = useUser();
  
  if (!isLoaded) {
    return <Loading />;
  }
  
  if (!isSignedIn) {
    return <Navigate to="/" />;
  }
  
  // Check for required role if specified
  if (requiredRole) {
    const userRole = user.publicMetadata.role as string;
    if (userRole !== requiredRole && userRole !== "admin") {
      return <Navigate to="/unauthorized" />;
    }
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
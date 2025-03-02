import { useEffect, useRef } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useUser, UserButton } from "@clerk/clerk-react";
import { ChakraProvider } from "@chakra-ui/react";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import AdminPage from "./pages/AdminPage";
import SuperAdminPage from "./pages/SuperAdminPage";
import UnauthorizedPage from "./pages/UnauthorizedPage";
import { Box, Button } from "@chakra-ui/react";
import "./App.css";
import Loading from "./components/Loading";
import { useState } from "react";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuthFetch } from "./utils/authUtils";

const App = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [error, setError] = useState<string | null>(null);
  const { authFetch } = useAuthFetch();

  // Add a ref to track if we've already synced
  const hasSyncedRef = useRef(false);

  useEffect(() => {
    const syncUserWithBackend = async () => {
      if (isSignedIn && user) {
        try {
          // Use the user ID directly
          const response = await fetch("http://localhost:4000/api/users/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.id}`, // Use ID instead of token
            },
            body: JSON.stringify({
              clerkId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              firstName: user.firstName,
              lastName: user.lastName,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to sync user with backend");
          }

          console.log("User synced successfully with backend");
        } catch (err) {
          console.error("Error syncing user:", err);
        }
      }
    };

    syncUserWithBackend();
  }, [isSignedIn, user]);

  // Updated syncRoleMetadata with proper safeguards
  const syncRoleMetadata = async () => {
    try {
      // Guard clause to prevent infinite loops
      if (!isSignedIn || !user || hasSyncedRef.current) return;

      // Mark that we've started syncing
      hasSyncedRef.current = true;

      const backendUser = await authFetch(
        "http://localhost:4000/api/users/current"
      );

      if (backendUser && backendUser.role) {
        try {
          // Only update if needed
          const currentMetadata = user.unsafeMetadata || {};
          if (currentMetadata.role !== backendUser.role) {
            await user.update({
              unsafeMetadata: { role: backendUser.role },
            });
            console.log("Role synced to Clerk:", backendUser.role);
          } else {
            console.log("Role already synced, skipping update");
          }
        } catch (clerkError) {
          console.error("Clerk API error:", clerkError);
        }
      }
    } catch (error) {
      console.error("Error syncing roles:", error);
    }
  };

  // Update the useEffect to only run once when user is available
  useEffect(() => {
    if (isSignedIn && user && !hasSyncedRef.current) {
      syncRoleMetadata();
    }

    // Clean up function to reset the ref if the user changes
    return () => {
      hasSyncedRef.current = false;
    };
  }, [isSignedIn, user]); // Only re-run if auth state changes

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <ChakraProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Admin route for resource management */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* SuperAdmin route for approvals */}
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute requiredRole="superAdmin">
                <SuperAdminPage />
              </ProtectedRoute>
            }
          />

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>

        {/* Global Message Display for Errors */}
        {error && (
          <Box
            position="fixed"
            bottom={4}
            right={4}
            bg="red.500"
            color="white"
            p={3}
            borderRadius="md"
            boxShadow="lg"
          >
            {error}
            <Button size="sm" ml={2} onClick={() => setError(null)}>
              Close
            </Button>
          </Box>
        )}
      </Router>
    </ChakraProvider>
  );
};

export default App;

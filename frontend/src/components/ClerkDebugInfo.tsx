import React from "react";
import { useUser, useAuth } from "@clerk/clerk-react";

const ClerkDebugInfo: React.FC = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();

  // Only show in development
  if (import.meta.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: "10px",
        right: "10px",
        background: "#f0f0f0",
        padding: "10px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "12px",
        maxWidth: "300px",
        zIndex: 9999,
      }}
    >
      <h4>🔧 Clerk Debug Info</h4>
      <p>
        <strong>Publishable Key:</strong>{" "}
        {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? "✅ Set" : "❌ Missing"}
      </p>
      <p>
        <strong>Key Preview:</strong>{" "}
        {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.substring(0, 20)}...
      </p>
      <p>
        <strong>API URL:</strong> {import.meta.env.VITE_API_URL || "Not set"}
      </p>
      <p>
        <strong>Clerk Loaded:</strong> {isLoaded ? "✅" : "❌"}
      </p>
      <p>
        <strong>User Signed In:</strong> {isSignedIn ? "✅" : "❌"}
      </p>
      <p>
        <strong>User ID:</strong> {user?.id || "None"}
      </p>
      <p>
        <strong>Current Domain:</strong> {window.location.origin}
      </p>
    </div>
  );
};

export default ClerkDebugInfo;

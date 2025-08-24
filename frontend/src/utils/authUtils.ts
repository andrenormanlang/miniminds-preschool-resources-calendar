import { useUser, useAuth } from "@clerk/clerk-react";
import { useState, useCallback } from "react";

export const useAuthFetch = () => {
  const { getToken } = useAuth();
  const { user, isSignedIn } = useUser();
  const [error, setError] = useState<Error | null>(null);

  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      try {
        if (!isSignedIn || !user) {
          throw new Error("User not authenticated");
        }

        // Get token or just use user ID directly
        const token = user.id; // Using Clerk user ID as the token

        // Set up headers with authorization
        const headers = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options.headers,
        };

        // Make the fetch request
        const response = await fetch(url, {
          ...options,
          headers,
          body: options.body,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Request failed");
        }

        return await response.json();
      } catch (err) {
        console.error("Auth fetch error:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        throw err;
      }
    },
    [isSignedIn, user]
  );

  // Add a method to just get the token or user ID for custom fetch calls
  const getAuthToken = useCallback(async () => {
    if (!isSignedIn || !user) {
      throw new Error("User not authenticated");
    }
    return user.id; // Return the user ID as the token
  }, [isSignedIn, user]);

  return {
    authFetch,
    error,
    getToken: getAuthToken,
  };
};

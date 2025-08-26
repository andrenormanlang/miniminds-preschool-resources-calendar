import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import clerkAppearance from "./utils/clerkTheme";
import { ResourceApprovalProvider } from "./contexts/ResourceApprovalContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import preschoolTheme from "./theme/preschoolTheme";

// Your Clerk publishable key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  console.error("❌ VITE_CLERK_PUBLISHABLE_KEY is missing!");
  console.error("Available env vars:", Object.keys(import.meta.env));
  console.error("🔧 Fix this by:");
  console.error("1. Setting VITE_CLERK_PUBLISHABLE_KEY in your environment");
  console.error("2. Making sure it's available at build time");
  console.error("3. Checking your Clerk dashboard for the correct key");
  throw new Error("Missing Publishable Key - Check console for details");
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data is considered fresh for 5 minutes
      retry: 1, // Only retry failed requests once
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={clerkPubKey} appearance={clerkAppearance}>
        <ChakraProvider theme={preschoolTheme}>
          <ResourceApprovalProvider>
            <App />
          </ResourceApprovalProvider>
        </ChakraProvider>
      </ClerkProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

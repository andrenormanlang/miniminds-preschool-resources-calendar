import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { ChakraProvider } from "@chakra-ui/react";
import App from "./App";
import clerkAppearance from "./utils/clerkTheme";
import { ResourceApprovalProvider } from "./contexts/ResourceApprovalContext";

// Your Clerk publishable key
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey} appearance={clerkAppearance}>
      <ChakraProvider>
        <ResourceApprovalProvider>
          <App />
        </ResourceApprovalProvider>
      </ChakraProvider>
    </ClerkProvider>
  </React.StrictMode>
);

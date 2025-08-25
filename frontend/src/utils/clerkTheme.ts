// Clerk theme configuration for preschool learning platform
// Child-friendly and warm styling for the UserButton and dropdown

interface ClerkThemeConfig {
  elements?: Record<string, Record<string, unknown>>;
  variables?: Record<string, unknown>;
}

const clerkAppearance: ClerkThemeConfig = {
  elements: {
    // Avatar styling - larger with friendly border
    userButtonAvatarBox: {
      width: "44px",
      height: "44px",
      backgroundColor: "transparent",
      border: "2px solid #1890FF",
      borderRadius: "50%",
      transition: "all 0.2s ease",
    },
    userButtonTrigger: {
      padding: "2px",
      border: "none",
      borderRadius: "50%",
      "&:hover": {
        transform: "scale(1.05)",
      },
    },
    // Avatar image itself
    userButtonAvatarImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: "50%",
    },

    // Dropdown/popover styling with soft preschool aesthetic
    userButtonPopover: {
      borderRadius: "16px",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
      border: "1px solid #E2E8F0",
      overflow: "hidden",
      fontFamily: '"Open Sans", "Nunito", sans-serif',
      minWidth: "240px",
    },

    // User info section in dropdown
    userButtonPopoverActionButtonText: {
      fontSize: "15px",
      fontWeight: "600",
      fontFamily: '"Open Sans", "Nunito", sans-serif',
    },

    // Dropdown options - more playful hover effects
    userButtonPopoverActionButton: {
      padding: "14px 20px",
      transition: "all 0.3s ease",
      fontSize: "15px",
      fontWeight: "500",
      marginBottom: "4px",
      borderRadius: "12px",
      margin: "0 8px",
      fontFamily: '"Open Sans", "Nunito", sans-serif',

      // Enhanced hover effect with preschool colors
      "&:hover": {
        backgroundColor: "#E6F7FF",
        color: "#1890FF",
        transform: "translateX(4px)",
        boxShadow: "0 2px 8px rgba(24, 144, 255, 0.15)",
      },
    },

    // Username section styling
    userButtonPopoverIdentifierText: {
      fontSize: "16px",
      fontWeight: "600",
      color: "#2D3748",
    },

    // User email styling
    userButtonPopoverIdentifierSubtext: {
      fontSize: "13px",
      color: "#718096",
    },

    // Footer section of dropdown
    userButtonPopoverFooter: {
      padding: "12px 20px",
      borderTop: "1px solid #E2E8F0",
      backgroundColor: "#F8FAFC",
    },

    // Sign in/up forms styling
    formButtonPrimary: {
      backgroundColor: "#1890FF",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: "600",
      padding: "12px 24px",
      transition: "all 0.2s ease",
      "&:hover": {
        backgroundColor: "#096DD9",
        transform: "translateY(-1px)",
      },
    },

    // Form input fields
    formFieldInput: {
      borderRadius: "10px",
      border: "2px solid #E2E8F0",
      fontSize: "15px",
      padding: "12px 16px",
      fontFamily: '"Open Sans", "Nunito", sans-serif',
      "&:focus": {
        borderColor: "#1890FF",
        boxShadow: "0 0 0 3px rgba(24, 144, 255, 0.1)",
      },
    },

    // Form labels
    formFieldLabel: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#374151",
      fontFamily: '"Open Sans", "Nunito", sans-serif',
    },
  },
  variables: {
    colorPrimary: "#1890FF",
    colorSuccess: "#2E8B57",
    colorWarning: "#FFD700",
    colorDanger: "#FF6B6B",
    colorText: "#2D3748",
    colorBackground: "#FFFFFF",
    colorInputBackground: "#FFFFFF",
    colorInputText: "#374151",
    fontFamily: '"Open Sans", "Nunito", sans-serif',
    fontSize: "15px",
    fontWeight: "500",
    borderRadius: "12px",
  },
};

export default clerkAppearance;

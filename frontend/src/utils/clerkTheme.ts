// Clerk theme configuration for preschool learning platform
// Child-friendly and warm styling for the UserButton and dropdown

const clerkAppearance = {
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

    // Dropdown card styling - more playful and rounded
    userButtonPopoverCard: {
      border: "2px solid",
      borderColor: "#E6F7FF",
      boxShadow:
        "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      borderRadius: "16px",
      padding: "16px 0",
      backgroundColor: "#F0F8FF",
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
        transform: "translateX(6px) scale(1.02)",
        boxShadow: "0 4px 12px rgba(24, 144, 255, 0.15)",
      },
    },

    // Icons in dropdown - friendly blue
    userButtonPopoverActionButtonIcon: {
      width: "22px",
      height: "22px",
      marginRight: "16px",
      color: "#1890FF",
      transition: "all 0.2s ease",
    },

    // Footer in dropdown
    userButtonPopoverFooter: {
      padding: "16px 20px",
      borderTop: "2px solid #E6F7FF",
      marginTop: "8px",
      borderRadius: "0 0 16px 16px",
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
        transform: "translateY(-2px)",
        boxShadow: "0 8px 16px rgba(24, 144, 255, 0.3)",
      },
    },

    // Input fields
    formFieldInput: {
      borderRadius: "12px",
      border: "2px solid #E6F7FF",
      fontSize: "15px",
      padding: "12px 16px",
      fontFamily: '"Open Sans", "Nunito", sans-serif',
      "&:focus": {
        borderColor: "#1890FF",
        boxShadow: "0 0 0 3px rgba(24, 144, 255, 0.1)",
      },
    },

    // Labels
    formFieldLabel: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#374151",
      fontFamily: '"Open Sans", "Nunito", sans-serif',
    },
  },
  variables: {
    colorPrimary: "#1890FF", // Friendly blue primary color
    colorSuccess: "#2E8B57", // Nature green for success
    colorWarning: "#FFD700", // Sunny yellow for warnings
    colorDanger: "#FF4757", // Soft red for errors
    colorText: "#374151", // Warm dark gray
    colorTextSecondary: "#6B7280", // Medium gray
    colorBackground: "#F0F8FF", // Alice blue background
    colorInputBackground: "#FFFFFF", // White input backgrounds
    colorInputText: "#374151", // Dark text in inputs
    fontFamily: '"Open Sans", "Nunito", sans-serif',
    fontSize: "15px",
    fontWeight: "500",
    borderRadius: "12px",
  },
};

export default clerkAppearance;
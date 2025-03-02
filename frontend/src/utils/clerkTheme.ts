// Clerk theme configuration for styling the UserButton and dropdown
// This can be imported and applied to ClerkProvider in your main App file

const clerkAppearance = {
  elements: {
    // Avatar styling - larger with no background
    userButtonAvatarBox: {
      width: "42px",
      height: "42px",
      backgroundColor: "transparent",
    },
    userButtonTrigger: {
      padding: "0",
      border: "none",
    },
    // Avatar image itself
    userButtonAvatarImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },

    // Dropdown card styling
    userButtonPopoverCard: {
      border: "1px solid",
      borderColor: "rgba(229, 231, 235, 1)",
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      borderRadius: "8px",
      padding: "12px 0",
    },

    // User info section in dropdown
    userButtonPopoverActionButtonText: {
      fontSize: "14px",
      fontWeight: "500",
    },

    // Dropdown options
    userButtonPopoverActionButton: {
      padding: "12px 16px",
      transition: "all 0.2s ease",
      fontSize: "14px",
      fontWeight: "500",
      marginBottom: "2px",

      // Enhanced hover effect
      "&:hover": {
        backgroundColor: "rgba(124, 58, 237, 0.1)", // Purple tint on hover
        color: "rgba(124, 58, 237, 1)",
        transform: "translateX(4px)",
      },
    },

    // Icons in dropdown
    userButtonPopoverActionButtonIcon: {
      width: "20px",
      height: "20px",
      marginRight: "14px",
      color: "rgba(124, 58, 237, 0.8)", // Purple-tinted icons
    },

    // Footer in dropdown
    userButtonPopoverFooter: {
      padding: "12px 16px",
      borderTop: "1px solid rgba(229, 231, 235, 1)",
      marginTop: "6px",
    },
  },
  variables: {
    colorPrimary: "rgba(124, 58, 237, 1)", // Purple primary color
    colorText: "rgba(55, 65, 81, 1)",
    colorTextSecondary: "rgba(107, 114, 128, 1)",
    fontFamily: "inherit",
  },
};

export default clerkAppearance;

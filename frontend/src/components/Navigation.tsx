import { UserButton } from "@clerk/clerk-react";

// Inside the component's JSX where the UserButton is rendered:
<UserButton
  appearance={{
    elements: {
      // Make the avatar larger and remove background
      userButtonAvatarBox: {
        width: "40px",
        height: "40px",
        background: "transparent",
      },
      userButtonTrigger: {
        padding: "0",
        border: "none",
      },
      // Style improvements for dropdown items
      userButtonPopoverCard: {
        border: "1px solid",
        borderColor: "gray.200",
        boxShadow: "xl",
        borderRadius: "md",
      },
      userButtonPopoverActionButton: {
        fontWeight: "500",
        padding: "12px 16px",
        // Improved hover state
        "&:hover": {
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          color: "purple.600",
        },
      },
      // Improve icon styling in dropdown
      userButtonPopoverActionButtonIcon: {
        color: "purple.500",
        marginRight: "12px",
        width: "20px",
        height: "20px",
      },
    },
  }}
/>;

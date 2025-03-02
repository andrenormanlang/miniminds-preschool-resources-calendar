import { UserButton } from "@clerk/clerk-react";

<UserButton
  appearance={{
    elements: {
      userButtonAvatarBox: {
        width: "40px",
        height: "40px",
        background: "transparent",
      },
      userButtonTrigger: {
        padding: "0",
        border: "none",
      },
      userButtonPopoverCard: {
        border: "1px solid",
        borderColor: "gray.200",
        boxShadow: "xl",
        borderRadius: "md",
      },
      userButtonPopoverActionButton: {
        fontWeight: "500",
        padding: "12px 16px",
        "&:hover": {
          backgroundColor: "rgba(99, 102, 241, 0.1)",
          color: "purple.600",
        },
      },
      userButtonPopoverActionButtonIcon: {
        color: "purple.500",
        marginRight: "12px",
        width: "20px",
        height: "20px",
      },
    },
  }}
/>;

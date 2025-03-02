import React from 'react';
import { Badge, Tooltip } from '@chakra-ui/react';

interface PendingApprovalBadgeProps {
  isApproved: boolean;
  position?: string;
}

const PendingApprovalBadge: React.FC<PendingApprovalBadgeProps> = ({ 
  isApproved, 
  position = "top-right" 
}) => {
  if (isApproved) return null;
  
  let positionStyles = {};
  
  switch (position) {
    case "top-right":
      positionStyles = { top: "8px", right: "8px" };
      break;
    case "top-left":
      positionStyles = { top: "8px", left: "8px" };
      break;
    case "bottom-right":
      positionStyles = { bottom: "8px", right: "8px" };
      break;
    case "bottom-left":
      positionStyles = { bottom: "8px", left: "8px" };
      break;
    default:
      positionStyles = { top: "8px", right: "8px" };
  }
  
  return (
    <Tooltip label="This resource is pending approval by a Super Admin">
      <Badge
        position="absolute"
        px={2}
        py={1}
        borderRadius="md"
        colorScheme="yellow"
        fontSize="xs"
        fontWeight="bold"
        zIndex={10}
        {...positionStyles}
      >
        PENDING
      </Badge>
    </Tooltip>
  );
};

export default PendingApprovalBadge;
import React from "react";
import {
  IconButton,
  useDisclosure,
  Tooltip,
  Box,
  useBreakpointValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FaBrain } from "react-icons/fa";
import AIAssistant from "./AIAssistant";

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const FloatingAIButton: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Responsive values
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });
  const bottomPosition = useBreakpointValue({ base: "16px", md: "20px" });
  const rightPosition = useBreakpointValue({ base: "16px", md: "20px" });

  return (
    <>
      <Box
        position="fixed"
        bottom={bottomPosition}
        right={rightPosition}
        zIndex={1000}
        // Add safe area support for mobile devices
        paddingBottom="env(safe-area-inset-bottom)"
        paddingRight="env(safe-area-inset-right)"
      >
        <Tooltip
          label="Ask Mini Minds AI Assistant"
          placement="left"
          hasArrow
          isDisabled={useBreakpointValue({ base: true, md: false })} // Disable tooltip on mobile
        >
          <IconButton
            aria-label="Open AI Assistant"
            icon={<FaBrain />}
            size={buttonSize}
            colorScheme="purple"
            isRound
            boxShadow="lg"
            onClick={onOpen}
            animation={`${pulse} 2s infinite`}
            _hover={{
              transform: "scale(1.1)",
              animation: "none",
            }}
            _active={{
              transform: "scale(0.95)",
            }}
            transition="transform 0.2s"
            // Better mobile touch target
            minW={{ base: "48px", md: "auto" }}
            minH={{ base: "48px", md: "auto" }}
          />
        </Tooltip>
      </Box>

      <AIAssistant isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default FloatingAIButton;

import React from "react";
import { IconButton, useDisclosure, Tooltip, Box } from "@chakra-ui/react";
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

  return (
    <>
      <Box position="fixed" bottom="20px" right="20px" zIndex={1000}>
        <Tooltip label="Ask Mini Minds AI Assistant" placement="left" hasArrow>
          <IconButton
            aria-label="Open AI Assistant"
            icon={<FaBrain />}
            size="lg"
            colorScheme="purple"
            isRound
            boxShadow="lg"
            onClick={onOpen}
            animation={`${pulse} 2s infinite`}
            _hover={{
              transform: "scale(1.1)",
              animation: "none",
            }}
            transition="transform 0.2s"
          />
        </Tooltip>
      </Box>

      <AIAssistant isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default FloatingAIButton;

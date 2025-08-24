import React, { useState } from "react";
import {
  Button,
  HStack,
  Icon,
  useToast,
  Textarea,
  VStack,
  Text,
  Card,
  CardBody,
  Badge,
  useDisclosure,
  Collapse,
} from "@chakra-ui/react";
import { FaMagic, FaCheckCircle, FaTimes } from "react-icons/fa";
import { useAIService } from "../services/aiService";

interface AIDescriptionEnhancerProps {
  title: string;
  description: string;
  type: string;
  ageGroup: string;
  subject: string;
  onEnhancementUpdate: (
    enhancedTitle: string,
    enhancedDescription: string
  ) => void;
}

const AIDescriptionEnhancer: React.FC<AIDescriptionEnhancerProps> = ({
  title,
  description,
  type,
  ageGroup,
  subject,
  onEnhancementUpdate,
}) => {
  const [enhancedTitle, setEnhancedTitle] = useState("");
  const [enhancedDescription, setEnhancedDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onToggle, onClose } = useDisclosure();
  const toast = useToast();
  const aiService = useAIService();

  const enhanceDescription = async () => {
    if (!title || !description || !type || !ageGroup || !subject) {
      toast({
        title: "Missing Information",
        description:
          "Please fill in all fields before enhancing the description.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await aiService.enhanceDescription(
        title,
        description,
        type,
        ageGroup,
        subject
      );

      console.log("Enhancement result:", result); // Debug log

      // Handle both object and string responses
      if (
        typeof result === "object" &&
        result !== null &&
        "title" in result &&
        "description" in result
      ) {
        setEnhancedTitle((result as any).title);
        setEnhancedDescription((result as any).description);
      } else if (typeof result === "string") {
        // Fallback: keep original title, use result as description
        setEnhancedTitle(title);
        setEnhancedDescription(result);
      } else {
        throw new Error("Invalid response format");
      }

      onToggle();

      toast({
        title: "Content Enhanced!",
        description: "AI has improved your activity title and description.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error enhancing description:", error);
      toast({
        title: "Error",
        description: "Failed to enhance content. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyEnhancement = () => {
    onEnhancementUpdate(enhancedTitle, enhancedDescription);
    onClose();
    toast({
      title: "Enhancement Applied!",
      description:
        "Your title and description have been updated with AI enhancements.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const discardEnhancement = () => {
    setEnhancedTitle("");
    setEnhancedDescription("");
    onClose();
  };

  return (
    <VStack align="stretch" spacing={3}>
      <Button
        onClick={enhanceDescription}
        isLoading={isLoading}
        loadingText="Enhancing..."
        leftIcon={<Icon as={FaMagic} />}
        colorScheme="purple"
        variant="outline"
        size="sm"
        disabled={!title || !description || !type || !ageGroup || !subject}
      >
        Enhance with AI
      </Button>

      <Collapse
        in={isOpen && (!!enhancedTitle || !!enhancedDescription)}
        animateOpacity
      >
        <Card variant="outline" borderColor="purple.200">
          <CardBody>
            <VStack align="stretch" spacing={3}>
              <HStack justify="space-between" align="center">
                <Text fontWeight="bold" fontSize="sm" color="purple.700">
                  AI Enhanced Content
                </Text>
                <Badge colorScheme="purple" variant="subtle">
                  Improved
                </Badge>
              </HStack>

              {/* Enhanced Title */}
              <VStack align="stretch" spacing={2}>
                <Text fontSize="xs" fontWeight="bold" color="gray.600">
                  Enhanced Title:
                </Text>
                <Textarea
                  value={enhancedTitle}
                  onChange={(e) => setEnhancedTitle(e.target.value)}
                  size="sm"
                  resize="vertical"
                  minH="60px"
                  bg="purple.50"
                  borderColor="purple.200"
                  _focus={{
                    borderColor: "purple.400",
                    boxShadow: "0 0 0 1px purple.400",
                  }}
                />
              </VStack>

              {/* Enhanced Description */}
              <VStack align="stretch" spacing={2}>
                <Text fontSize="xs" fontWeight="bold" color="gray.600">
                  Enhanced Description:
                </Text>
                <Textarea
                  value={enhancedDescription}
                  onChange={(e) => setEnhancedDescription(e.target.value)}
                  size="sm"
                  resize="vertical"
                  minH="120px"
                  bg="purple.50"
                  borderColor="purple.200"
                  _focus={{
                    borderColor: "purple.400",
                    boxShadow: "0 0 0 1px purple.400",
                  }}
                />
              </VStack>

              <HStack justify="flex-end" spacing={2}>
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Icon as={FaTimes} />}
                  onClick={discardEnhancement}
                >
                  Discard
                </Button>
                <Button
                  size="sm"
                  colorScheme="green"
                  leftIcon={<Icon as={FaCheckCircle} />}
                  onClick={applyEnhancement}
                >
                  Apply Changes
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      </Collapse>
    </VStack>
  );
};

export default AIDescriptionEnhancer;

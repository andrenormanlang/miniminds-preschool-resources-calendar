import React, { useState } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Badge,
  useToast,

  Icon,
  Collapse,
  useDisclosure,

} from "@chakra-ui/react";
import {
  FaLightbulb,
  FaChevronDown,
  FaChevronUp,
  FaCheckCircle,

} from "react-icons/fa";
import { useAIService } from "../services/aiService";
import type { AISuggestion } from "../types/type.d";

interface ContentSuggestion {
  title: string;
  description: string;
  materials?: string;
  objectives?: string;
  safety?: string;
}

interface AISuggestionsProps {
  ageGroup: string;
  subject: string;
  type: string;
  onSuggestionSelect?: (suggestion: ContentSuggestion) => void;
}

const AISuggestions: React.FC<AISuggestionsProps> = ({
  ageGroup,
  subject,
  type,
  onSuggestionSelect,
}) => {
  const [suggestions, setSuggestions] = useState<ContentSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const { isOpen, onToggle } = useDisclosure();
  const toast = useToast();
  const aiService = useAIService();

  const generateSuggestions = async () => {
    if (!ageGroup || !subject || !type) {
      toast({
        title: "Missing Information",
        description: "Please select age group, subject, and type first.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await aiService.generateSuggestions(
        ageGroup,
        subject,
        type
      );

      console.log("AI Service Result:", result); // Debug log

      // Handle both array and object responses
      let suggestionsArray: ContentSuggestion[] = [];

      if (Array.isArray(result)) {
        // Result is already an array of suggestions
        suggestionsArray = result.map((item: AISuggestion) => ({
          title: item.title || "Untitled Activity",
          description: item.description || "No description available",
          materials: item.materials || "",
          objectives: item.objectives || "",
          safety: item.safety || "",
        }));
      } else if (result && typeof result === "object") {
        // Result is an object, check if it has suggestions property
        const resultObj = result as Record<string, unknown>;
        if (resultObj.suggestions) {
          if (Array.isArray(resultObj.suggestions)) {
            suggestionsArray = resultObj.suggestions.map((item: AISuggestion) => ({
              title: item.title || "Untitled Activity",
              description: item.description || "No description available",
              materials: item.materials || "",
              objectives: item.objectives || "",
              safety: item.safety || "",
            }));
          } else {
            // If suggestions is a string, create a single suggestion
            suggestionsArray = [
              {
                title: `${type} Ideas for ${ageGroup}`,
                description: String(resultObj.suggestions),
              },
            ];
          }
        } else {
          // Treat the entire object as a single suggestion
          const objAsSuggestion = resultObj as unknown as AISuggestion;
          suggestionsArray = [
            {
              title: objAsSuggestion.title || `${type} Ideas for ${ageGroup}`,
              description: objAsSuggestion.description || "No description available",
              materials: objAsSuggestion.materials || "",
              objectives: objAsSuggestion.objectives || "",
              safety: objAsSuggestion.safety || "",
            }
          ];
        }
      } else {
        // Fallback for unexpected response format
        suggestionsArray = [
          {
            title: `${type} Ideas for ${ageGroup}`,
            description:
              typeof result === "string"
                ? result
                : "Failed to generate suggestions. Please try again.",
          },
        ];
      }

      // Ensure we have valid suggestions
      if (suggestionsArray.length === 0) {
        throw new Error("No suggestions were generated");
      }

      setSuggestions(suggestionsArray);
      if (!isOpen) onToggle();

      toast({
        title: "Suggestions Generated!",
        description: `Found ${suggestionsArray.length} creative ideas for you.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error generating suggestions:", error);
      toast({
        title: "Error",
        description: "Failed to generate suggestions. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (suggestion: ContentSuggestion) => {
    if (onSuggestionSelect) {
      onSuggestionSelect(suggestion);
    }
    toast({
      title: "Suggestion Applied!",
      description: "The AI suggestion has been applied to your form.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
  };

  const toggleExpand = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <Box>
      <Button
        onClick={generateSuggestions}
        isLoading={isLoading}
        loadingText="Generating..."
        leftIcon={<Icon as={FaLightbulb} />}
        colorScheme="purple"
        variant="outline"
        size="md"
        w="100%"
        disabled={!ageGroup || !subject || !type}
      >
        Get AI Suggestions
      </Button>

      <Collapse in={isOpen && suggestions.length > 0} animateOpacity>
        <Box mt={4}>
          <HStack justify="space-between" mb={3}>
            <Heading size="sm" color="purple.600">
              AI Generated Ideas
            </Heading>
            <Badge colorScheme="purple" variant="subtle">
              {suggestions.length} suggestions
            </Badge>
          </HStack>

          <VStack spacing={3} align="stretch">
            {suggestions.map((suggestion, index) => (
              <Card key={index} variant="outline" borderColor="purple.200">
                <CardHeader pb={2}>
                  <HStack justify="space-between" align="center">
                    <Heading size="sm" color="purple.700">
                      {suggestion.title}
                    </Heading>
                    <HStack>
                      {onSuggestionSelect && (
                        <Button
                          size="xs"
                          colorScheme="green"
                          leftIcon={<Icon as={FaCheckCircle} />}
                          onClick={() => handleSelectSuggestion(suggestion)}
                        >
                          Use This
                        </Button>
                      )}
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => toggleExpand(index)}
                        rightIcon={
                          <Icon
                            as={
                              expandedCard === index
                                ? FaChevronUp
                                : FaChevronDown
                            }
                          />
                        }
                      >
                        {expandedCard === index ? "Less" : "More"}
                      </Button>
                    </HStack>
                  </HStack>
                </CardHeader>

                <CardBody pt={0}>
                  <Text fontSize="sm" color="gray.600" mb={2}>
                    {suggestion.description}
                  </Text>

                  <Collapse in={expandedCard === index} animateOpacity>
                    <VStack align="stretch" spacing={3} mt={3}>
                      {suggestion.materials && (
                        <Box>
                          <Text fontWeight="bold" fontSize="sm" mb={1}>
                            Materials Needed:
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {suggestion.materials}
                          </Text>
                        </Box>
                      )}

                      {suggestion.objectives && (
                        <Box>
                          <Text fontWeight="bold" fontSize="sm" mb={1}>
                            Learning Objectives:
                          </Text>
                          <Text fontSize="sm" color="gray.600">
                            {suggestion.objectives}
                          </Text>
                        </Box>
                      )}

                      {suggestion.safety && (
                        <Box>
                          <Text
                            fontWeight="bold"
                            fontSize="sm"
                            mb={1}
                            color="red.600"
                          >
                            Safety Considerations:
                          </Text>
                          <Text fontSize="sm" color="red.600">
                            {suggestion.safety}
                          </Text>
                        </Box>
                      )}
                    </VStack>
                  </Collapse>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
};

export default AISuggestions;

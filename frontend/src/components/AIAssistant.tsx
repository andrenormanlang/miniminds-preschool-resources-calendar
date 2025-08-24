import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Button,
  Input,
  VStack,
  HStack,
  Text,
  Avatar,
  useToast,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  Icon,
  Badge,
  Spinner,
  Card,
  CardBody,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaBrain, FaPaperPlane, FaUser, FaRobot } from "react-icons/fa";
import { useAIService } from "../services/aiService";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: Date;
}

interface AIAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const toast = useToast();
  const aiService = useAIService();

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chat opens
      const welcomeMessage: Message = {
        id: "welcome",
        content:
          "Hi! I'm your MiniMinds AI Assistant! 🧠✨ I'm here to help you with early childhood education. You can ask me about:\n\n• Activity ideas for different age groups\n• Learning objectives and development\n• Educational games and crafts\n• Safety tips for activities\n• Age-appropriate learning strategies\n\nWhat would you like to know?",
        role: "assistant",
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setStreamingMessage("");

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Use streaming for a better user experience
      const response = await aiService.chatStream(
        input,
        conversationHistory,
        (chunk) => {
          setStreamingMessage(chunk);
        }
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setStreamingMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatMessageContent = (content: string) => {
    // Simple formatting for better readability
    return content.split("\n").map((line, index) => (
      <Text key={index} mb={line.trim() ? 2 : 1}>
        {line || "\u00A0"}
      </Text>
    ));
  };

  return (
    <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="md">
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader borderBottomWidth="1px">
          <HStack spacing={3}>
            <Avatar
              size="sm"
              icon={<FaBrain />}
              bg="purple.500"
              color="white"
            />
            <VStack align="start" spacing={0}>
              <Text fontWeight="bold" fontSize="lg">
                MiniMinds AI Assistant
              </Text>
              <Badge colorScheme="green" size="sm">
                Online
              </Badge>
            </VStack>
          </HStack>
        </DrawerHeader>

        <DrawerBody p={0}>
          <VStack spacing={4} align="stretch" h="100%" overflowY="auto" p={4}>
            {messages.map((message) => (
              <HStack
                key={message.id}
                justify={message.role === "user" ? "flex-end" : "flex-start"}
                align="flex-start"
                spacing={3}
              >
                {message.role === "assistant" && (
                  <Avatar
                    size="sm"
                    icon={<FaRobot />}
                    bg="purple.500"
                    color="white"
                  />
                )}
                <Card
                  maxW="80%"
                  bg={message.role === "user" ? "blue.500" : bgColor}
                  color={message.role === "user" ? "white" : "inherit"}
                  borderColor={borderColor}
                  borderWidth={message.role === "assistant" ? 1 : 0}
                >
                  <CardBody p={3}>
                    {formatMessageContent(message.content)}
                    <Text fontSize="xs" opacity={0.7} mt={2} textAlign="right">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </CardBody>
                </Card>
                {message.role === "user" && (
                  <Avatar
                    size="sm"
                    icon={<FaUser />}
                    bg="blue.500"
                    color="white"
                  />
                )}
              </HStack>
            ))}

            {/* Streaming message */}
            {streamingMessage && (
              <HStack justify="flex-start" align="flex-start" spacing={3}>
                <Avatar
                  size="sm"
                  icon={<FaRobot />}
                  bg="purple.500"
                  color="white"
                />
                <Card
                  maxW="80%"
                  bg={bgColor}
                  borderColor={borderColor}
                  borderWidth={1}
                >
                  <CardBody p={3}>
                    {formatMessageContent(streamingMessage)}
                    {isLoading && (
                      <HStack mt={2}>
                        <Spinner size="xs" />
                        <Text fontSize="xs" opacity={0.7}>
                          Typing...
                        </Text>
                      </HStack>
                    )}
                  </CardBody>
                </Card>
              </HStack>
            )}

            <div ref={messagesEndRef} />
          </VStack>
        </DrawerBody>

        <DrawerFooter borderTopWidth="1px" p={4}>
          <HStack w="100%" spacing={2}>
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about early childhood education..."
              resize="none"
              minH="40px"
              maxH="120px"
              isDisabled={isLoading}
              flex={1}
            />
            <Button
              colorScheme="purple"
              onClick={handleSendMessage}
              isLoading={isLoading}
              isDisabled={!input.trim()}
              leftIcon={<Icon as={FaPaperPlane} />}
              size="md"
            >
              Send
            </Button>
          </HStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AIAssistant;

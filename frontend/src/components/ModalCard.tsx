// src/components/ModalCard.tsx

import React from "react";
import {
  Box,
  Heading,
  Button,
  Flex,
  Text,
  Image,
  Badge,
  useToast,
  VStack,
  Icon,
  Tag,
  IconButton,
  Tooltip,
  AspectRatio,
  useColorModeValue,
  HStack,
  Divider,
} from "@chakra-ui/react";
import { Resource } from "../types/type";
import { useUser } from "@clerk/clerk-react";
import { useAuthFetch } from "../utils/authUtils";
import {
  FaEdit,
  FaTrash,
  FaCalendarAlt,
  FaBookOpen,
  FaChild,
  FaLayerGroup,
} from "react-icons/fa";
import { motion } from "framer-motion";

// Animation variants for content elements
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerChildren = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Styled motion components
const MotionBox = motion(Box);
const MotionFlex = motion(Flex);
const MotionVStack = motion(VStack);

type ModalCardProps = {
  resource: Resource;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  canEdit: boolean;
  canDelete: boolean;
};

const ModalCard: React.FC<ModalCardProps> = ({
  resource,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
}) => {
  const { isSignedIn } = useUser();
  const { authFetch } = useAuthFetch();
  const toast = useToast();
  const [currentUserRole, setCurrentUserRole] = React.useState<string | null>(
    null
  );
  const [currentUserId, setCurrentUserId] = React.useState<number | null>(null);

  // Fetch current user details when component mounts
  React.useEffect(() => {
    const getCurrentUserInfo = async () => {
      if (isSignedIn) {
        try {
          const currentUser = await authFetch(
            "http://localhost:4000/api/users/current"
          );
          setCurrentUserRole(currentUser.role);
          setCurrentUserId(currentUser.id);
        } catch (err) {
          console.error("Failed to get current user info:", err);
        }
      }
    };

    getCurrentUserInfo();
  }, [isSignedIn, authFetch]);

  // Function to approve a resource (superAdmin only)
  const canApproveResource = () => {
    return currentUserRole === "superAdmin" && !resource?.isApproved;
  };

  const handleApprove = async () => {
    try {
      await authFetch(
        `http://localhost:4000/api/resources/${resource?.id}/approve`,
        {
          method: "PATCH",
          body: JSON.stringify({ approve: true }),
        }
      );

      toast({
        title: "Resource approved",
        status: "success",
        duration: 3000,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to approve resource",
        status: "error",
        duration: 5000,
      });
    }
  };

  const textColor = useColorModeValue("gray.800", "white");
  const metadataColor = useColorModeValue("gray.600", "gray.400");

  // Get a tag color based on resource type
  const getTypeColor = (type: string) => {
    const colorMap: Record<string, string> = {
      Activity: "blue",
      Printable: "green",
      Game: "purple",
      Book: "red",
      Song: "pink",
      Craft: "orange",
      Experiment: "teal",
      OutdoorActivity: "cyan",
      DigitalResource: "linkedin",
      LessonPlan: "yellow",
      VideoLink: "messenger",
      ParentTip: "gray",
    };

    return colorMap[type] || "blue";
  };

  return (
    <Box>
      {/* Hero Image Section */}
      <MotionBox
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        position="relative"
        overflow="hidden"
        borderRadius="lg"
        mb={6}
      >
        <AspectRatio ratio={16 / 9} w="100%">
          <Image
            src={
              resource.imageUrl ||
              "https://via.placeholder.com/800x450?text=No+Image+Available"
            }
            alt={resource.title}
            objectFit="cover"
            width="100%"
            height="100%"
            fallbackSrc="https://via.placeholder.com/800x450?text=Loading..."
          />
        </AspectRatio>
      </MotionBox>

      {/* Content Section */}
      <MotionVStack
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
        spacing={6}
        align="stretch"
      >
        {/* Tags and Type */}
        <MotionBox variants={fadeIn}>
          <HStack spacing={2} wrap="wrap">
            <Tag
              size="md"
              colorScheme={getTypeColor(resource.type)}
              fontWeight="bold"
            >
              {resource.type}
            </Tag>
            <Tag size="md" colorScheme="blue">
              {resource.subject}
            </Tag>
            <Tag size="md" colorScheme="green">
              {resource.ageGroup}
            </Tag>
          </HStack>
        </MotionBox>

        {/* Date */}
        <MotionFlex
          variants={fadeIn}
          justify="space-between"
          align="center"
          bg={useColorModeValue("blue.50", "blue.900")}
          p={4}
          borderRadius="md"
        >
          <HStack spacing={2}>
            <Icon as={FaCalendarAlt} color="blue.500" boxSize={5} />
            <Text fontWeight="bold">
              {new Date(resource.eventDate).toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </HStack>

          {(canEdit || canDelete) && (
            <HStack spacing={2}>
              {canEdit && (
                <Tooltip label="Edit resource" hasArrow>
                  <IconButton
                    aria-label="Edit resource"
                    icon={<FaEdit />}
                    onClick={onEdit}
                    colorScheme="blue"
                    variant="ghost"
                    size="md"
                  />
                </Tooltip>
              )}
              {canDelete && (
                <Tooltip label="Delete resource" hasArrow>
                  <IconButton
                    aria-label="Delete resource"
                    icon={<FaTrash />}
                    onClick={onDelete}
                    colorScheme="red"
                    variant="ghost"
                    size="md"
                  />
                </Tooltip>
              )}
            </HStack>
          )}
        </MotionFlex>

        {/* Description Section */}
        <MotionBox variants={fadeIn}>
          <Heading size="md" mb={2} color={textColor}>
            Description
          </Heading>
          <Text
            fontSize="md"
            color={textColor}
            lineHeight="tall"
            whiteSpace="pre-line"
          >
            {resource.description}
          </Text>
        </MotionBox>

        <Divider />

        {/* Resource Details */}
        <MotionVStack variants={fadeIn} spacing={4} align="stretch">
          <Heading size="md" color={textColor}>
            Resource Details
          </Heading>

          <HStack spacing={8} flexWrap="wrap">
            <VStack align="flex-start" minW="150px" mb={2}>
              <HStack>
                <Icon as={FaLayerGroup} color="purple.500" />
                <Text fontWeight="semibold" color={metadataColor}>
                  Type:
                </Text>
              </HStack>
              <Text ml={6}>{resource.type}</Text>
            </VStack>

            <VStack align="flex-start" minW="150px" mb={2}>
              <HStack>
                <Icon as={FaBookOpen} color="green.500" />
                <Text fontWeight="semibold" color={metadataColor}>
                  Subject:
                </Text>
              </HStack>
              <Text ml={6}>{resource.subject}</Text>
            </VStack>

            <VStack align="flex-start" minW="150px" mb={2}>
              <HStack>
                <Icon as={FaChild} color="orange.500" />
                <Text fontWeight="semibold" color={metadataColor}>
                  Age Group:
                </Text>
              </HStack>
              <Text ml={6}>{resource.ageGroup}</Text>
            </VStack>
          </HStack>

          {resource.userId && (
            <Box>
              <Text fontWeight="semibold" color={metadataColor}>
                Created by:
                <Badge ml={2} colorScheme="blue">
                  {resource.user
                    ? `${resource.user.firstName || ""} ${
                        resource.user.lastName || ""
                      }`.trim()
                    : "Unknown User"}
                </Badge>
              </Text>
            </Box>
          )}
        </MotionVStack>

        {/* Approve Button (for superAdmin) */}
        {canApproveResource() && (
          <Button colorScheme="green" onClick={handleApprove} w="full">
            Approve Resource
          </Button>
        )}

        {/* Action Buttons - Full Width for Mobile */}
        {(canEdit || canDelete) && (
          <MotionFlex
            variants={fadeIn}
            mt={4}
            justifyContent="space-between"
            flexWrap="wrap"
            gap={2}
          >
            {canEdit && (
              <Button
                leftIcon={<FaEdit />}
                colorScheme="blue"
                onClick={onEdit}
                flex={["1 0 100%", "1 0 48%"]}
              >
                Edit Resource
              </Button>
            )}
            {canDelete && (
              <Button
                leftIcon={<FaTrash />}
                colorScheme="red"
                variant="outline"
                onClick={onDelete}
                flex={["1 0 100%", "1 0 48%"]}
              >
                Delete
              </Button>
            )}
          </MotionFlex>
        )}
      </MotionVStack>
    </Box>
  );
};

export default ModalCard;

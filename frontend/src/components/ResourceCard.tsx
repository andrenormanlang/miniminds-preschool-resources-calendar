import React from "react";
import {
  Box,
  Text,
  Badge,
  Image,
  VStack,
  HStack,
  Icon,
  Button,
  AspectRatio,
  useColorModeValue,
  Tooltip,
  useBreakpointValue,
} from "@chakra-ui/react";
import { CalendarIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { FaUsers, FaGraduationCap, FaBookOpen } from "react-icons/fa";
import { Resource } from "../types/type";

interface ResourceCardProps {
  resource: Resource;
  bgColor?: string;
  canEdit?: boolean;
  canDelete?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onClick?: () => void;
  isDragging?: boolean;
}

const formatCardDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });
};

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  bgColor = "white",
  canEdit = false,
  canDelete = false,
  onEdit,
  onDelete,
  onClick,
  isDragging = false,
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger card click if clicking on action buttons
    if ((e.target as HTMLElement).closest("[data-action-button]")) {
      return;
    }
    onClick?.();
  };

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      boxShadow={isDragging ? "2xl" : "md"}
      border="1px solid"
      borderColor={borderColor}
      overflow="hidden"
      cursor={onClick ? "pointer" : "default"}
      onClick={handleCardClick}
      position="relative"
      transition="all 0.2s"
      _hover={{
        transform: onClick ? "translateY(-2px)" : "none",
        boxShadow: onClick ? "lg" : "md",
      }}
      height="100%"
      minH={{ base: "280px", md: "320px" }}
    >
      {/* Date Badge */}
      <Badge
        position="absolute"
        top={3}
        right={3}
        bg="blue.500"
        color="white"
        px={2}
        py={1}
        borderRadius="md"
        fontSize={{ base: "xs", md: "sm" }}
        fontWeight="bold"
        zIndex={2}
        display="flex"
        alignItems="center"
        gap={1}
      >
        <Icon as={CalendarIcon} boxSize={3} />
        {formatCardDate(resource.eventDate)}
      </Badge>

      {/* Approval Status Badge */}
      {!resource.isApproved && (
        <Badge
          position="absolute"
          top={3}
          left={3}
          bg="orange.500"
          color="white"
          px={2}
          py={1}
          borderRadius="md"
          fontSize="xs"
          fontWeight="bold"
          zIndex={2}
        >
          Pending
        </Badge>
      )}

      <VStack spacing={0} height="100%">
        {/* Image Section */}
        {resource.imageUrl && (
          <AspectRatio ratio={16 / 9} w="100%">
            <Image
              src={resource.imageUrl}
              alt={resource.title}
              objectFit="cover"
              borderTopRadius="xl"
            />
          </AspectRatio>
        )}

        {/* Content Section */}
        <VStack
          p={{ base: 3, md: 4 }}
          spacing={{ base: 2, md: 3 }}
          align="stretch"
          flex="1"
          w="100%"
        >
          {/* Title */}
          <Text
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="bold"
            color="gray.800"
            lineHeight="short"
            noOfLines={2}
            minH={{ base: "2.5rem", md: "3rem" }}
          >
            {resource.title}
          </Text>

          {/* Description */}
          <Text
            fontSize={{ base: "sm", md: "md" }}
            color="gray.600"
            lineHeight="base"
            noOfLines={{ base: 2, md: 3 }}
            flex="1"
          >
            {resource.description}
          </Text>

          {/* Tags Section */}
          <VStack spacing={2} align="stretch">
            <HStack spacing={2} flexWrap="wrap" justify="center">
              <Tooltip label="Subject">
                <Badge
                  colorScheme="blue"
                  variant="subtle"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontSize="xs"
                  display="flex"
                  alignItems="center"
                  gap={1}
                  maxW="120px"
                >
                  <Icon as={FaBookOpen} boxSize={3} />
                  <Text noOfLines={1}>{resource.subject}</Text>
                </Badge>
              </Tooltip>

              <Tooltip label="Type">
                <Badge
                  colorScheme="green"
                  variant="subtle"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontSize="xs"
                  display="flex"
                  alignItems="center"
                  gap={1}
                  maxW="120px"
                >
                  <Icon as={FaGraduationCap} boxSize={3} />
                  <Text noOfLines={1}>{resource.type}</Text>
                </Badge>
              </Tooltip>
            </HStack>

            <HStack justify="center">
              <Tooltip label="Age Group">
                <Badge
                  colorScheme="purple"
                  variant="subtle"
                  px={2}
                  py={1}
                  borderRadius="md"
                  fontSize="xs"
                  display="flex"
                  alignItems="center"
                  gap={1}
                  maxW="140px"
                >
                  <Icon as={FaUsers} boxSize={3} />
                  <Text noOfLines={1}>{resource.ageGroup}</Text>
                </Badge>
              </Tooltip>
            </HStack>
          </VStack>

          {/* Action Buttons */}
          {(canEdit || canDelete) && (
            <HStack
              spacing={2}
              justify="center"
              pt={2}
              borderTop="1px solid"
              borderColor={borderColor}
              mt="auto"
            >
              {canEdit && (
                <Button
                  size={isMobile ? "sm" : "md"}
                  colorScheme="blue"
                  variant="ghost"
                  leftIcon={<EditIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.();
                  }}
                  data-action-button
                  flex="1"
                  fontSize={isMobile ? "xs" : "sm"}
                >
                  Edit
                </Button>
              )}
              {canDelete && (
                <Button
                  size={isMobile ? "sm" : "md"}
                  colorScheme="red"
                  variant="ghost"
                  leftIcon={<DeleteIcon />}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.();
                  }}
                  data-action-button
                  flex="1"
                  fontSize={isMobile ? "xs" : "sm"}
                >
                  Delete
                </Button>
              )}
            </HStack>
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default ResourceCard;

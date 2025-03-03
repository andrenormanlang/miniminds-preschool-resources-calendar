import React from "react";
import { Box, Text, Badge, Image, Flex, IconButton } from "@chakra-ui/react";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { Resource } from "../types/type";

interface ResourceCardProps {
  resource: Resource;
  backgroundColor: string;
  onCardClick: (resource: Resource) => void;
  onEdit?: (resource: Resource) => void;
  onDelete?: (id: number) => void;
  canEdit: boolean;
  canDelete: boolean;
  showApprovalStatus: boolean;
}

const formatCardDate = (dateString: string) => {
  const date = new Date(dateString);
  // Format as "29 April" (day and month name)
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });
};

const ResourceCard: React.FC<ResourceCardProps> = ({
  resource,
  backgroundColor,
  onCardClick,
  onEdit,
  onDelete,
  canEdit,
  canDelete,
  showApprovalStatus,
}) => {
  const renderApprovalStatus = () => {
    if (!showApprovalStatus) return null;
    return (
      <Badge
        position="absolute"
        top="8px"
        left="8px"
        colorScheme={resource.isApproved ? "green" : "yellow"}
        zIndex={1}
      >
        {resource.isApproved ? "Approved" : "Pending"}
      </Badge>
    );
  };

  return (
    <Box
      onClick={() => onCardClick(resource)}
      cursor="pointer"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
      position="relative"
      bg={backgroundColor}
      transition="transform 0.3s, box-shadow 0.3s"
      _hover={{
        transform: "translateY(-5px)",
        boxShadow: "xl",
      }}
    >
      {renderApprovalStatus()}

      <Text
        position="absolute"
        top={2}
        right={2}
        bg="blue.500"
        color="white"
        px={2}
        py={1}
        borderRadius="md"
        fontSize="sm"
        fontWeight="bold"
        zIndex={1}
      >
        {formatCardDate(resource.eventDate)}
      </Text>

      <Image
        src={resource.imageUrl || "https://via.placeholder.com/300x200"}
        alt={resource.title}
        height="200px"
        width="100%"
        objectFit="cover"
      />

      <Box p={4}>
        <Text
          fontWeight="semibold"
          fontSize="xl"
          mb={2}
          noOfLines={1}
          color="gray.800"
        >
          {resource.title}
        </Text>

        <Flex mb={3} wrap="wrap" gap={2}>
          <Badge colorScheme="blue" variant="solid">
            {resource.type}
          </Badge>
          <Badge colorScheme="green" variant="solid">
            {resource.subject}
          </Badge>
          <Badge colorScheme="purple" variant="solid">
            {resource.ageGroup}
          </Badge>
        </Flex>

        <Text noOfLines={3} color="gray.700" mb={3}>
          {resource.description}
        </Text>

        <Flex mt={4} justify="flex-end" gap={2}>
          {canEdit && (
            <IconButton
              icon={<EditIcon />}
              aria-label="Edit"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(resource);
              }}
              colorScheme="blue"
              bg="blue.500"
              color="white"
              size="sm"
              _hover={{
                bg: "blue.600",
                transform: "scale(1.1)",
              }}
              _active={{
                bg: "blue.700",
              }}
            />
          )}

          {canDelete && (
            <IconButton
              icon={<DeleteIcon />}
              aria-label="Delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(resource.id);
              }}
              colorScheme="red"
              bg="red.500"
              color="white"
              size="sm"
              _hover={{
                bg: "red.600",
                transform: "scale(1.1)",
              }}
              _active={{
                bg: "red.700",
              }}
            />
          )}
        </Flex>
      </Box>
    </Box>
  );
};

export default ResourceCard;

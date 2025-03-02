import React from "react";
import { Text } from "@chakra-ui/react";

const formatCardDate = (dateString: string) => {
  const date = new Date(dateString);
  // Format as "29 April" (day and month name)
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });
};

const ResourceCard: React.FC = () => {
  // Assuming resource is defined in the component
  const resource = { eventDate: "2024-04-29" }; // Replace with actual data

  return (
    <div>
      {/* Assuming the card date is displayed in the top right corner */}
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
    </div>
  );
};

export default ResourceCard;

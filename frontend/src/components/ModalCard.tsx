import React from 'react';
import {
  Box,
  Heading,
  Button,
  Flex,
  Text,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Badge,
} from '@chakra-ui/react';
import { Resource } from '../types/type';

type ModalCardProps = {
  resource?: Resource; // Made optional to accommodate cases when resource is not provided
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  bgColor: string;
  children?: React.ReactNode; // Add this line
};

const ModalCard: React.FC<ModalCardProps> = ({
  resource,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  bgColor,
  children, // Destructure children
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent
        borderRadius="lg"
        bg={bgColor}
        color="white"
        boxShadow="2xl"
        overflow="hidden"
        p={0}
      >
        {children ? (
          // Render children if provided
          <>{children}</>
        ) : resource ? (
          // Render resource details if resource is provided
          <>
            {/* Existing code to display resource details */}
            {/* Date Badge Overlay */}
            <Box position="relative">
              <Image
                src={resource.imageUrl}
                alt={resource.title}
                objectFit="cover"
                width="100%"
                height="250px"
                borderTopRadius="lg"
              />
              {/* Date Badge in the Top Right Corner */}
              <Badge
                fontFamily={'AbeeZee'}
                fontWeight={'900'}
                position="absolute"
                top="10px"
                right="10px"
                backgroundColor="rgba(0,0,0,0.7)"
                color="white"
                fontSize="md"
                px={3}
                py={1}
                borderRadius="md"
                boxShadow="lg"
              >
                {new Date(resource.eventDate).toLocaleDateString()}
              </Badge>
            </Box>

            {/* Move title underneath the image */}
            <Box p={6}>
              <Heading
                fontFamily={'AbeeZee'}
                fontWeight={'600'}
                size="lg"
                textAlign="center"
                mb={4}
                color="white"
              >
                {resource.title}
              </Heading>

              {/* Card Body */}
              <ModalBody p={0}>
                <Box mb={4}>
                  {/* Subject and Age Group */}
                  <Text
                    fontFamily={'Montserrat Alternates'}
                    fontSize="lg"
                    fontWeight="bold"
                    color="yellow.300"
                    mb={2}
                  >
                    {resource.subject}
                  </Text>
                  <Text
                    fontFamily={'AbeeZee'}
                    fontSize="lg"
                    color="yellow.100"
                    mb={2}
                  >
                    Age Group: {resource.ageGroup}
                  </Text>

                  {/* Rating */}
                  <Text
                    fontFamily={'Montserrat Alternates'}
                    fontSize="lg"
                    fontWeight="bold"
                    color="yellow.300"
                    mb={2}
                  >
                    Rating: {resource.rating}
                  </Text>

                  {/* Description */}
                  <Text
                    fontFamily={'AbeeZee'}
                    mt={4}
                    fontSize="md"
                    color="gray.100"
                    lineHeight="1.8"
                  >
                    {resource.description}
                  </Text>
                </Box>
              </ModalBody>
            </Box>
            <Flex justifyContent="space-between" mt={4} p={6}>
              <Button colorScheme="blue" onClick={onEdit}>
                Edit
              </Button>
              <Button colorScheme="red" onClick={onDelete}>
                Delete
              </Button>
            </Flex>
          </>
        ) : null}
      </ModalContent>
    </Modal>
  );
};

export default ModalCard;

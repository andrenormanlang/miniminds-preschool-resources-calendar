// src/components/ModalCard.tsx

import React, { useRef } from 'react';
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
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useToast,
} from '@chakra-ui/react';
import { Resource } from '../types/type';
import { useUser } from "@clerk/clerk-react";
import { useAuthFetch } from "../utils/authUtils";

// Define FocusableElement
type FocusableElement = HTMLElement;

type ModalCardProps = {
  resource?: Resource;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  children?: React.ReactNode;
};

const ModalCard: React.FC<ModalCardProps> = ({
  resource,
  isOpen,
  onClose,
  onEdit,
  onDelete,
  children,
}) => {
  const { user, isSignedIn } = useUser();
  const { authFetch } = useAuthFetch();
  const toast = useToast();
  const [currentUserRole, setCurrentUserRole] = React.useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = React.useState<number | null>(null);

  // Fetch current user details when the modal opens
  React.useEffect(() => {
    const getCurrentUserInfo = async () => {
      if (isSignedIn && isOpen) {
        try {
          const currentUser = await authFetch("http://localhost:4000/api/users/current");
          setCurrentUserRole(currentUser.role);
          setCurrentUserId(currentUser.id);
        } catch (err) {
          console.error("Failed to get current user info:", err);
        }
      }
    };

    getCurrentUserInfo();
  }, [isSignedIn, authFetch, isOpen]);

  // Function to check if user can edit this resource
  const canEditResource = () => {
    if (!isSignedIn || !currentUserRole) return false;
    
    // SuperAdmin can edit any resource
    if (currentUserRole === 'superAdmin') return true;
    
    // Admin can only edit their own resources
    if (currentUserRole === 'admin') {
      return resource?.userId === currentUserId;
    }
    
    return false;
  };

  // Function to check if user can delete this resource
  const canDeleteResource = () => {
    // Same logic as edit permission
    return canEditResource();
  };

  // Function to approve a resource (superAdmin only)
  const canApproveResource = () => {
    return currentUserRole === 'superAdmin' && !resource?.isApproved;
  };

  const handleApprove = async () => {
    try {
      await authFetch(`http://localhost:4000/api/resources/${resource?.id}/approve`, {
        method: "PATCH",
        body: JSON.stringify({ approve: true }),
      });

      toast({
        title: "Resource approved",
        status: "success",
        duration: 3000,
      });
      
      // Update the resource in the modal
      resource.isApproved = true;
      
      // Close the modal and refresh
      onClose();
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

  // Ref for the "Nej" (Cancel) button in AlertDialog
  const cancelRef = useRef<HTMLButtonElement>(null);

  // State to control the AlertDialog
  const [isAlertOpen, setIsAlertOpen] = React.useState<boolean>(false);

  const openAlert = () => setIsAlertOpen(true);
  const closeAlert = () => setIsAlertOpen(false);

  const confirmDelete = () => {
    onDelete();
    closeAlert();
    onClose(); // Close the main modal after deletion
  };

  // Typecast cancelRef to RefObject<FocusableElement>
  const leastDestructiveRef = cancelRef as React.RefObject<FocusableElement>;

  return (
    <>
      {/* Main Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent
          borderRadius="lg"
          bgGradient="linear(to-b, orange.400, pink.400)" // Colorful gradient background
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
              {/* Image with Date Badge */}
              <Box position="relative">
                <Image
                  src={resource.imageUrl || "https://via.placeholder.com/600x400?text=No+Image"}
                  alt={resource.title}
                  objectFit="cover"
                  width="100%"
                  height="250px"
                  borderTopRadius="lg"
                />
                {/* Date Badge */}
                <Badge
                  fontFamily={'AbeeZee'}
                  fontWeight={'900'}
                  position="absolute"
                  top="10px"
                  right="10px"
                  backgroundColor="rgba(0,0,0,0.5)"
                  color="white"
                  fontSize="md"
                  px={3}
                  py={1}
                  borderRadius="md"
                  boxShadow="lg"
                >
                  {new Date(resource.eventDate).toLocaleDateString('sv-SE')}
                </Badge>
              </Box>

              {/* Title */}
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

                {/* Modal Body */}
                <ModalBody p={0}>
                  <Box mb={4}>
                    {/* Subject */}
                    <Text
                      fontFamily={'Montserrat Alternates'}
                      fontSize="lg"
                      fontWeight="bold"
                      color="yellow.200"
                      mb={2}
                    >
                      {resource.subject}
                    </Text>
                    {/* Age Group */}
                    <Text
                      fontFamily={'AbeeZee'}
                      fontSize="lg"
                      color="whiteAlpha.800"
                      mb={2}
                    >
                      Åldersgrupp: {resource.ageGroup} år
                    </Text>
                    {/* Rating */}
                    <Text
                      fontFamily={'Montserrat Alternates'}
                      fontSize="lg"
                      fontWeight="bold"
                      color="yellow.200"
                      mb={2}
                    >
                      Betyg: {resource.rating}
                    </Text>
                    {/* Description */}
                    <Text
                      fontFamily={'AbeeZee'}
                      mt={4}
                      fontSize="md"
                      color="whiteAlpha.800"
                      lineHeight="1.8"
                    >
                      {resource.description}
                    </Text>
                  </Box>
                </ModalBody>
              </Box>

              {/* Action Buttons */}
              <Flex justifyContent="space-between" mt={4} p={6}>
                <Box>
                  {canApproveResource() && (
                    <Button colorScheme="green" mr={3} onClick={handleApprove}>
                      Approve
                    </Button>
                  )}
                </Box>
                <Box>
                  {canEditResource() && (
                    <Button colorScheme="blue" mr={3} onClick={onEdit}>
                      Edit
                    </Button>
                  )}
                  {canDeleteResource() && (
                    <Button colorScheme="red" onClick={openAlert}>
                      Delete
                    </Button>
                  )}
                </Box>
              </Flex>
            </>
          ) : null}
        </ModalContent>
      </Modal>

      {/* Confirmation AlertDialog */}
      <AlertDialog
        isOpen={isAlertOpen}
        leastDestructiveRef={leastDestructiveRef}
        onClose={closeAlert}
        isCentered
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Bekräfta Radering
            </AlertDialogHeader>

            <AlertDialogBody>
              Är du säker på att du vill ta bort evenemanget?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={closeAlert}>
                Nej
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                Ja
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default ModalCard;

import React, { useEffect, useState, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  Container,
  Badge,
  Image,
  Tag,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  useToast,
  Spinner,
  IconButton,
} from "@chakra-ui/react";
import ModalCard from "../components/ModalCard";
import EventForm from "../components/EventForm";
import { Resource } from "../types/type";
import Loading from "../components/Loading";
import { useAuthFetch } from "../utils/authUtils";
import { useLocation, useNavigate } from "react-router-dom";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";

// Function to get a random color for the cards
const getRandomColor = () => {
  const colors = [
    "blue.50",
    "teal.50",
    "green.50",
    "purple.50",
    "pink.50",
    "orange.50",
    "yellow.50",
    "cyan.50",
    "red.50",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

type FormData = {
  title: string;
  type: string;
  subject: string;
  ageGroup: string;
  rating: number;
  description: string;
  eventDate: string;
  imageUrl: string;
};

// Add a date formatting function
const formatCardDate = (dateString: string) => {
  const date = new Date(dateString);
  // Format as "29 April" (day and month name)
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });
};

const HomePage = () => {
  const { user, isSignedIn } = useUser();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<
    Resource | undefined
  >(undefined);
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI modal controls
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const toast = useToast();
  const { authFetch } = useAuthFetch();
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Get URL parameters to check if we should open the add resource form
  const params = new URLSearchParams(location.search);
  const shouldAddResource = params.get("addResource") === "true";

  // Add state for resource colors
  const [resourceColors, setResourceColors] = useState<Record<number, string>>(
    {}
  );

  // Effect to open the form when the URL parameter is present
  useEffect(() => {
    if (shouldAddResource && canAddResource()) {
      handleAddEvent();

      // Clear the URL parameter after handling it
      navigate("/", { replace: true });
    }
  }, [shouldAddResource]);

  useEffect(() => {
    const getResources = async () => {
      try {
        // Fetch resources from API
        const response = await fetch("http://localhost:4000/api/resources");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Explicitly sort resources by date in ascending order
        const sortedResources = [...data].sort((a, b) => {
          // Parse dates and compare timestamp values
          const dateA = new Date(a.eventDate).getTime();
          const dateB = new Date(b.eventDate).getTime();
          return dateA - dateB;
        });

        console.log(
          "Resources sorted by date:",
          sortedResources.map((r) => ({
            title: r.title,
            date: r.eventDate,
            formattedDate: formatCardDate(r.eventDate),
          }))
        );

        setResources(sortedResources);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching resources:", error);
        setError("Failed to load resources");
        setLoading(false);
      }
    };

    getResources();
  }, []);

  useEffect(() => {
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
      } else {
        setCurrentUserRole(null);
        setCurrentUserId(null);
      }
    };

    getCurrentUserInfo();
  }, [isSignedIn, authFetch]);

  // Generate stable random colors for resources
  useEffect(() => {
    if (resources.length > 0) {
      const newColors: Record<number, string> = {};

      resources.forEach((resource) => {
        // Only generate a color if one doesn't exist yet
        if (!resourceColors[resource.id]) {
          newColors[resource.id] = getRandomColor();
        }
      });

      // Update resource colors if we have new ones
      if (Object.keys(newColors).length > 0) {
        setResourceColors((prevColors) => ({ ...prevColors, ...newColors }));
      }
    }
  }, [resources]);

  const handleAddEvent = () => {
    setSelectedResource(undefined);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleEditEvent = (resource: Resource) => {
    setSelectedResource(resource);
    setIsEditMode(true);
    setIsFormOpen(true);
    onClose(); // Close the detail modal when opening edit form
  };

  const handleCardClick = (resource: Resource) => {
    setSelectedResource(resource);
    onOpen();
  };

  const handleFormSubmit = async (data: FormData) => {
    try {
      // Ensure the date is in ISO format
      const isoFormattedDate = new Date(data.eventDate).toISOString();

      const payload = {
        ...data,
        eventDate: isoFormattedDate,
      };

      if (isEditMode && selectedResource) {
        // For editing existing resource
        await authFetch(
          `http://localhost:4000/api/resources/${selectedResource.id}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          }
        );

        // Update local state
        setResources(
          resources.map((r) =>
            r.id === selectedResource.id ? { ...r, ...payload } : r
          )
        );

        toast({
          title: "Resource updated",
          status: "success",
          duration: 3000,
        });
      } else {
        // For creating new resource
        const newResource = await authFetch(
          "http://localhost:4000/api/resources",
          {
            method: "POST",
            body: JSON.stringify(payload),
          }
        );

        setResources([newResource, ...resources]);

        toast({
          title: "Resource created",
          status: "success",
          duration: 3000,
        });
      }

      setIsFormOpen(false);
    } catch (err) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      if (!isSignedIn) {
        throw new Error("You must be logged in to delete resources");
      }

      // Use authFetch instead of manual token handling
      await authFetch(`http://localhost:4000/api/resources/${id}`, {
        method: "DELETE",
      });

      setResources((prevResources) =>
        prevResources.filter((res) => res.id !== id)
      );

      toast({
        title: "Resource deleted",
        status: "success",
        duration: 3000,
      });

      onClose();
    } catch (err) {
      console.error(err);
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const renderApprovalStatus = (resource: Resource) => {
    if (!isSignedIn) return null;
    if (!user?.publicMetadata?.role || user.publicMetadata.role === "user")
      return null;

    return (
      <Badge
        position="absolute"
        top="8px"
        left="8px"
        colorScheme={resource.isApproved ? "green" : "yellow"}
        zIndex="1"
      >
        {resource.isApproved ? "Approved" : "Pending"}
      </Badge>
    );
  };

  // Function to check if user can add resources
  const canAddResource = () => {
    return currentUserRole === "admin" || currentUserRole === "superAdmin";
  };

  // Function to check if user can edit this specific resource
  const canEditResource = (resource: Resource) => {
    if (!isSignedIn || !currentUserRole) return false;

    // SuperAdmin can edit any resource
    if (currentUserRole === "superAdmin") return true;

    // Admin can only edit their own resources
    if (currentUserRole === "admin") {
      return resource.userId === currentUserId;
    }

    return false;
  };

  // Function to check if user can delete this specific resource
  const canDeleteResource = (resource: Resource) => {
    // Same logic as edit permission
    return canEditResource(resource);
  };

  if (loading) return <Loading />;

  return (
    <Box
      minH="calc(100vh - 70px)"
      w="100%"
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        bgGradient:
          "linear(to-r, red.500, orange.500, yellow.500, green.500, blue.500, purple.500)",
        opacity: 0.8,
        zIndex: -1,
      }}
      p={8}
    >
      <Container maxW="1300px" centerContent>
        {/* Header - removed Add Resource button */}
        <Box
          w="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={8}
          flexDirection={["column", "column", "row"]}
          gap={4}
          bgColor="rgba(0,0,0,0.6)"
          p={4}
          borderRadius="md"
        >
          <Heading
            fontFamily="Montserrat Alternates"
            fontWeight="700"
            as="h1"
            size={["xl", "2xl"]}
            textAlign="center"
            color="white"
          >
            Preschool Learning Resources
          </Heading>
        </Box>

        {/* Resource Grid */}
        {loading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" color="white" />
            <Text mt={4} color="white" fontSize="lg">
              Loading resources...
            </Text>
          </Box>
        ) : resources.length > 0 ? (
          <SimpleGrid
            columns={[1, 2, 3, 4]}
            spacing={6}
            mt={8}
            sx={{
              gridAutoFlow: "row",
              display: "grid",
              gridTemplateColumns: {
                base: "repeat(1, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(4, 1fr)",
              },
            }}
          >
            {resources.map((resource) => {
              return (
                <Box
                  key={resource.id}
                  onClick={() => handleCardClick(resource)}
                  cursor="pointer"
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  boxShadow="md"
                  position="relative"
                  bg={resourceColors[resource.id] || "white"} // Use the precomputed color or default to white
                  transition="transform 0.3s, box-shadow 0.3s"
                  _hover={{
                    transform: "translateY(-5px)",
                    boxShadow: "xl",
                  }}
                >
                  {/* Badge for approval status */}
                  {renderApprovalStatus(resource)}

                  {/* Date badge - top right */}
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

                  {/* Image */}
                  <Image
                    src={
                      resource.imageUrl || "https://via.placeholder.com/300x200"
                    }
                    alt={resource.title}
                    height="200px"
                    width="100%"
                    objectFit="cover"
                  />

                  {/* Card content - this part keeps the random background color */}
                  <Box p={4}>
                    <Text
                      fontWeight="semibold"
                      fontSize="xl"
                      mb={2}
                      noOfLines={1}
                    >
                      {resource.title}
                    </Text>

                    <Flex mb={3} wrap="wrap" gap={2}>
                      <Badge colorScheme="blue">{resource.type}</Badge>
                      <Badge colorScheme="green">{resource.subject}</Badge>
                      <Badge colorScheme="purple">{resource.ageGroup}</Badge>
                    </Flex>

                    <Text noOfLines={3} color="gray.600" mb={3}>
                      {resource.description}
                    </Text>

                    {/* Action buttons */}
                    <Flex mt={4} justify="flex-end">
                      {canEditResource(resource) && (
                        <IconButton
                          icon={<EditIcon />}
                          aria-label="Edit"
                          mr={2}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEvent(resource);
                          }}
                          colorScheme="blue"
                          variant="ghost"
                          size="sm"
                        />
                      )}

                      {canDeleteResource(resource) && (
                        <IconButton
                          icon={<DeleteIcon />}
                          aria-label="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(resource.id);
                          }}
                          colorScheme="red"
                          variant="ghost"
                          size="sm"
                        />
                      )}
                    </Flex>
                  </Box>
                </Box>
              );
            })}
          </SimpleGrid>
        ) : (
          <Box textAlign="center" py={10}>
            <Text fontSize="xl" color="white">
              No resources available.
            </Text>
          </Box>
        )}
      </Container>

      {/* Resource Detail Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        scrollBehavior="inside"
        isCentered
      >
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent maxW="800px" borderRadius="lg" boxShadow="2xl">
          <ModalHeader
            pb={1}
            fontSize="2xl"
            borderBottom="1px solid"
            borderColor="gray.200"
          >
            {selectedResource?.title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody py={4}>
            {selectedResource && (
              <ModalCard
                resource={selectedResource}
                isOpen={isOpen}
                onClose={onClose}
                onEdit={() => handleEditEvent(selectedResource)}
                onDelete={() => handleDeleteEvent(selectedResource.id)}
                canEdit={canEditResource(selectedResource)}
                canDelete={canDeleteResource(selectedResource)}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        size="xl"
        scrollBehavior="inside"
      >
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent>
          <ModalHeader>
            {isEditMode ? "Edit Resource" : "Add New Resource"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <EventForm
              resource={selectedResource}
              onSubmit={handleFormSubmit}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Error message */}
      {error && (
        <Box
          position="fixed"
          bottom={4}
          right={4}
          bg="red.500"
          color="white"
          p={3}
          borderRadius="md"
          boxShadow="lg"
        >
          {error}
          <Button size="sm" ml={2} onClick={() => setError(null)}>
            Close
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default HomePage;

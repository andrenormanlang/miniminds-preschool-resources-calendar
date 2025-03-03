import React, { useState, useEffect } from "react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate } from "react-router-dom";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import ModalCard from "../components/ModalCard";
import EventForm from "../components/EventForm";
import { Resource } from "../types/type";
import Loading from "../components/Loading";
import { useResourceApi } from "../services/api";

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
  const [selectedResource, setSelectedResource] = useState<
    Resource | undefined
  >();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const resourceApi = useResourceApi();
  const [resourceColors, setResourceColors] = useState<Record<number, string>>(
    {}
  );

  // Queries
  const {
    data: resources = [],
    isLoading: isLoadingResources,
    error: resourcesError,
  } = useQuery({
    queryKey: ["resources"],
    queryFn: resourceApi.getAllResources,
    select: (data) => {
      // Sort resources by date
      return [...data].sort((a, b) => {
        return (
          new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
        );
      });
    },
  });

  const {
    data: currentUser,
    isLoading: isLoadingUser,
    error: userError,
  } = useQuery({
    queryKey: ["currentUser"],
    queryFn: resourceApi.getCurrentUser,
    enabled: isSignedIn,
  });

  // Mutations
  const createResourceMutation = useMutation({
    mutationFn: resourceApi.createResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast({
        title: "Resource created",
        status: "success",
        duration: 3000,
      });
      setIsFormOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating resource",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    },
  });

  const updateResourceMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Resource> }) =>
      resourceApi.updateResource(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast({
        title: "Resource updated",
        status: "success",
        duration: 3000,
      });
      setIsFormOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating resource",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    },
  });

  const deleteResourceMutation = useMutation({
    mutationFn: resourceApi.deleteResource,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
      toast({
        title: "Resource deleted",
        status: "success",
        duration: 3000,
      });
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: "Error deleting resource",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    },
  });

  // Effect to handle resource colors
  useEffect(() => {
    if (resources.length > 0) {
      const newColors: Record<number, string> = {};
      resources.forEach((resource) => {
        if (!resourceColors[resource.id]) {
          newColors[resource.id] = getRandomColor();
        }
      });
      if (Object.keys(newColors).length > 0) {
        setResourceColors((prev) => ({ ...prev, ...newColors }));
      }
    }
  }, [resources]);

  // Effect to handle add resource from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("addResource") === "true" && canAddResource()) {
      handleAddEvent();
      navigate("/", { replace: true });
    }
  }, [location.search]);

  const handleAddEvent = () => {
    setSelectedResource(undefined);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleEditEvent = (resource: Resource) => {
    setSelectedResource(resource);
    setIsEditMode(true);
    setIsFormOpen(true);
    onClose();
  };

  const handleCardClick = (resource: Resource) => {
    setSelectedResource(resource);
    onOpen();
  };

  const handleFormSubmit = async (data: Omit<Resource, "id">) => {
    const isoFormattedDate = new Date(data.eventDate).toISOString();
    const payload = { ...data, eventDate: isoFormattedDate };

    if (isEditMode && selectedResource) {
      updateResourceMutation.mutate({
        id: selectedResource.id,
        data: payload,
      });
    } else {
      createResourceMutation.mutate(payload);
    }
  };

  const handleDeleteEvent = (id: number) => {
    if (!isSignedIn) {
      toast({
        title: "Error",
        description: "You must be logged in to delete resources",
        status: "error",
        duration: 5000,
      });
      return;
    }
    deleteResourceMutation.mutate(id);
  };

  // Permission checks
  const canAddResource = () => {
    return currentUser?.role === "admin" || currentUser?.role === "superAdmin";
  };

  const canEditResource = (resource: Resource) => {
    if (!isSignedIn || !currentUser?.role) return false;
    if (currentUser.role === "superAdmin") return true;
    if (currentUser.role === "admin") {
      return resource.userId === currentUser.id;
    }
    return false;
  };

  const canDeleteResource = canEditResource;

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

  if (isLoadingResources || isLoadingUser) return <Loading />;

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
        {isLoadingResources ? (
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

                  {/* Card content */}
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

                    {/* Action buttons */}
                    <Flex mt={4} justify="flex-end" gap={2}>
                      {canEditResource(resource) && (
                        <IconButton
                          icon={<EditIcon />}
                          aria-label="Edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditEvent(resource);
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

                      {canDeleteResource(resource) && (
                        <IconButton
                          icon={<DeleteIcon />}
                          aria-label="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteEvent(resource.id);
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
    </Box>
  );
};

export default HomePage;

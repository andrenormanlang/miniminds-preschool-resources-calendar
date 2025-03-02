import { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import ModalCard from "../components/ModalCard";
import EventForm from "../components/EventForm";
import { Resource } from "../types/type";
import Loading from "../components/Loading";
import { useAuthFetch } from "../utils/authUtils";
import { useLocation, useNavigate } from "react-router-dom";

// Function to get a random color for the cards
const getRandomColor = () => {
  const colors = [
    "orange.200",
    "pink.200",
    "cyan.200",
    "purple.200",
    "blue.200",
    "yellow.200",
    "green.200",
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
  const shouldAddResource = params.get('addResource') === 'true';
  
  // Effect to open the form when the URL parameter is present
  useEffect(() => {
    if (shouldAddResource && canAddResource()) {
      handleAddEvent();
      
      // Clear the URL parameter after handling it
      navigate('/', { replace: true });
    }
  }, [shouldAddResource]);

  useEffect(() => {
    const getResources = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/resources");
        if (!response.ok) {
          throw new Error("Failed to fetch resources");
        }
        const data = await response.json();
        setResources(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    getResources();
  }, []);

  useEffect(() => {
    const getCurrentUserInfo = async () => {
      if (isSignedIn) {
        try {
          const currentUser = await authFetch("http://localhost:4000/api/users/current");
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

  const handleAddEvent = () => {
    setIsEditMode(false);
    setSelectedResource(undefined);
    setIsFormOpen(true);
  };

  const handleEditEvent = (resource: Resource) => {
    if (!isSignedIn) {
      toast({
        title: "Authentication required",
        description: "You need to sign in to edit resources.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    setIsEditMode(true);
    setSelectedResource(resource);
    setIsFormOpen(true);
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
        eventDate: isoFormattedDate
      };

      if (isEditMode && selectedResource) {
        // For editing existing resource
        await authFetch(`http://localhost:4000/api/resources/${selectedResource.id}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });

        // Update local state
        setResources(
          resources.map((r) => (r.id === selectedResource.id ? { ...r, ...payload } : r))
        );

        toast({
          title: "Resource updated",
          status: "success",
          duration: 3000,
        });
      } else {
        // For creating new resource
        const newResource = await authFetch("http://localhost:4000/api/resources", {
          method: "POST",
          body: JSON.stringify(payload)
        });

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
    return currentUserRole === 'admin' || currentUserRole === 'superAdmin';
  };

  // Function to check if user can edit this specific resource
  const canEditResource = (resource: Resource) => {
    if (!isSignedIn || !currentUserRole) return false;
    
    // SuperAdmin can edit any resource
    if (currentUserRole === 'superAdmin') return true;
    
    // Admin can only edit their own resources
    if (currentUserRole === 'admin') {
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
        bgGradient: "linear(to-r, red.500, orange.500, yellow.500, green.500, blue.500, purple.500)",
        opacity: 0.8,
        zIndex: -1
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
        {resources.length > 0 ? (
          <SimpleGrid columns={[1, null, 2, 3]} spacing={10} px={[2, 4, 6]}>
            {resources.map((resource) => (
              <Box
                key={resource.id}
                position="relative"
                borderRadius="lg"
                overflow="hidden"
                bg={getRandomColor()}
                boxShadow="lg"
                onClick={() => handleCardClick(resource)}
                cursor="pointer"
                transition="transform 0.2s"
                _hover={{ transform: "scale(1.05)" }}
              >
                {/* Date Badge */}
                <Badge
                  fontFamily={"AbeeZee"}
                  fontWeight={"700"}
                  position="absolute"
                  top="8px"
                  right="8px"
                  backgroundColor="rgba(0,0,0,0.8)"
                  color="white"
                  p={1}
                  borderRadius="md"
                >
                  {new Date(resource.eventDate).toLocaleDateString("sv-SE")}
                </Badge>

                {/* Image */}
                <Image
                  src={
                    resource.imageUrl ||
                    "https://via.placeholder.com/300x150?text=No+Image"
                  }
                  alt={resource.title}
                  objectFit="cover"
                  w="100%"
                  h="150px"
                  fallbackSrc="https://via.placeholder.com/300x150?text=Loading..."
                />

                {/* Card Content */}
                <Box p={6}>
                  <Box display="flex" alignItems="baseline" mb={2}>
                    <Tag
                      fontFamily={"AbeeZee"}
                      fontWeight={"700"}
                      backgroundColor="blue.600"
                      color="white"
                      mr={2}
                    >
                      {resource.subject}
                    </Tag>
                    <Tag
                      fontFamily={"AbeeZee"}
                      fontWeight={"700"}
                      backgroundColor="green.600"
                      color="white"
                    >
                      {resource.ageGroup} år
                    </Tag>
                  </Box>

                  <Heading
                    fontFamily="Montserrat Alternates"
                    fontWeight={"900"}
                    as="h2"
                    size="md"
                    mb={2}
                    color="blue.900"
                  >
                    {resource.title}
                  </Heading>
                  <Text
                    fontFamily={"AbeeZee"}
                    fontWeight={"700"}
                    fontSize="sm"
                    color="gray.700"
                  >
                    Ämne: {resource.subject}
                  </Text>
                  <Text
                    fontFamily={"AbeeZee"}
                    fontWeight={"600"}
                    fontSize="sm"
                    color="gray.700"
                  >
                    Åldersgrupp: {resource.ageGroup}
                  </Text>
                  <Text
                    fontFamily={"AbeeZee"}
                    fontWeight={"600"}
                    fontSize="sm"
                    color="gray.700"
                  >
                    Betyg: {resource.rating}
                  </Text>
                </Box>
              </Box>
            ))}
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
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedResource?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedResource && (
              <ModalCard
                resource={selectedResource}
                onEdit={handleEditEvent}
                onDelete={() => handleDeleteEvent(selectedResource.id)}
                canEdit={canEditResource(selectedResource)}
                canDelete={canDeleteResource(selectedResource)}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Form Modal */}
      <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} size="xl">
        <ModalOverlay />
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
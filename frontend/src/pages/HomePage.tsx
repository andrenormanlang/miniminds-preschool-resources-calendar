// src/pages/HomePage.tsx
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
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
  useToast
} from '@chakra-ui/react';
import ModalCard from '../components/ModalCard';
import EventForm from '../components/EventForm';
import { Resource } from '../types/type';
import Loading from '../components/Loading';

// Function to get a random color for the cards
const getRandomColor = () => {
  const colors = [
    'orange.200',
    'pink.200',
    'cyan.200',
    'purple.200',
    'blue.200',
    'yellow.200',
    'green.200',
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
  const [selectedResource, setSelectedResource] = useState<Resource | undefined>(undefined);
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI modal controls
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const toast = useToast();
  
  useEffect(() => {
    const getResources = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/resources');
        if (!response.ok) {
          throw new Error('Failed to fetch resources');
        }
        const data = await response.json();
        setResources(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    getResources();
  }, []);

  // Function to get authentication token from Clerk
  const getToken = async () => {
    if (!isSignedIn) return null;
    try {
      return await user?.getToken();
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  };

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
      const token = await getToken();
      
      if (!token && isEditMode) {
        throw new Error('You must be logged in to edit resources');
      }
      
      let response;
      
      if (isEditMode && selectedResource) {
        response = await fetch(`http://localhost:4000/api/resources/${selectedResource.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(data),
        });
      } else {
        response = await fetch('http://localhost:4000/api/resources', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': isSignedIn ? `Bearer ${token}` : '' // Only send token if signed in
          },
          body: JSON.stringify(data),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit form');
      }

      const updatedResource = await response.json();

      if (isEditMode) {
        setResources((prevResources) =>
          prevResources.map((res) => (res.id === updatedResource.id ? updatedResource : res))
        );
        toast({
          title: "Resource updated",
          status: "success",
          duration: 3000,
        });
      } else {
        setResources((prevResources) => [...prevResources, updatedResource]);
        toast({
          title: "Resource created",
          status: "success",
          duration: 3000,
        });
      }

      setIsFormOpen(false);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
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
      const token = await getToken();
      
      if (!token) {
        throw new Error('You must be logged in to delete resources');
      }
      
      const response = await fetch(`http://localhost:4000/api/resources/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete event');
      }

      setResources((prevResources) => prevResources.filter((res) => res.id !== id));
      toast({
        title: "Resource deleted",
        status: "success",
        duration: 3000,
      });
      onClose();
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
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

  if (loading) return <Loading />;

  return (
    <Box
      minH="calc(100vh - 70px)"
      w="100%"
      bgGradient="linear(to-r, red.400, orange.400, yellow.400, green.400, blue.400, purple.400)"
      p={8}
    >
      <Container maxW="1300px" centerContent>
        {/* Header and Add Event Button */}
        <Box
          w="100%"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={8}
          flexDirection={["column", "column", "row"]}
          gap={4}
        >
          <Heading
            fontFamily="Montserrat Alternates"
            fontWeight="700"
            as="h1"
            size={["xl", "2xl"]}
            textAlign={["center", "center", "left"]}
            mt={8}
            color="white"
          >
            Preschool Learning Resources
          </Heading>
          <Button colorScheme="teal" onClick={handleAddEvent}>
            Add Resource
          </Button>
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
                _hover={{ transform: 'scale(1.05)' }}
              >
                {/* Date Badge */}
                <Badge
                  fontFamily={'AbeeZee'}
                  fontWeight={'700'}
                  position="absolute"
                  top="8px"
                  right="8px"
                  backgroundColor="rgba(0,0,0,0.6)"
                  color="white"
                  p={1}
                  borderRadius="md"
                >
                  {new Date(resource.eventDate).toLocaleDateString('sv-SE')}
                </Badge>

                {/* Image */}
                <Image
                  src={resource.imageUrl || 'https://via.placeholder.com/300x150?text=No+Image'}
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
                      fontFamily={'AbeeZee'}
                      fontWeight={'700'}
                      backgroundColor="blue.600"
                      color="white"
                      mr={2}
                    >
                      {resource.subject}
                    </Tag>
                    <Tag
                      fontFamily={'AbeeZee'}
                      fontWeight={'700'}
                      backgroundColor="green.600"
                      color="white"
                    >
                      {resource.ageGroup} år
                    </Tag>
                  </Box>

                  <Heading
                    fontFamily="Montserrat Alternates"
                    fontWeight={'900'}
                    as="h2"
                    size="md"
                    mb={2}
                    color="blue.900"
                  >
                    {resource.title}
                  </Heading>
                  <Text
                    fontFamily={'AbeeZee'}
                    fontWeight={'700'}
                    fontSize="sm"
                    color="gray.700"
                  >
                    Ämne: {resource.subject}
                  </Text>
                  <Text
                    fontFamily={'AbeeZee'}
                    fontWeight={'600'}
                    fontSize="sm"
                    color="gray.700"
                  >
                    Åldersgrupp: {resource.ageGroup}
                  </Text>
                  <Text
                    fontFamily={'AbeeZee'}
                    fontWeight={'600'}
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
          <Flex 
            direction="column" 
            align="center" 
            justify="center" 
            minH="300px"
            bg="white" 
            p={8} 
            borderRadius="lg"
            boxShadow="lg"
          >
            <Heading size="md" mb={4}>No resources found</Heading>
            <Text mb={4}>No learning resources are currently available.</Text>
            <Button colorScheme="blue" onClick={handleAddEvent}>
              Add your first resource
            </Button>
          </Flex>
        )}

        {/* Event Form Modal */}
        {isFormOpen && (
          <Modal
            isOpen={isFormOpen}
            onClose={() => setIsFormOpen(false)}
            size="lg"
            isCentered
            scrollBehavior="inside"
          >
            <ModalOverlay />
            <ModalContent
              maxHeight="80vh"
              overflow="hidden"
            >
              <ModalHeader>{isEditMode ? 'Edit Resource' : 'Add Resource'}</ModalHeader>
              <ModalCloseButton />
              <ModalBody overflowY="auto">
                <EventForm
                  resource={selectedResource}
                  onSubmit={handleFormSubmit}
                />
              </ModalBody>
            </ModalContent>
          </Modal>
        )}

        {/* View Resource Modal */}
        {selectedResource && (
          <ModalCard
            resource={selectedResource}
            isOpen={isOpen}
            onClose={onClose}
            onEdit={() => handleEditEvent(selectedResource)}
            onDelete={() => handleDeleteEvent(selectedResource.id)}
          />
        )}
      </Container>
      
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
          <Button 
            size="sm" 
            ml={2} 
            onClick={() => setError(null)}
          >
            Close
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default HomePage;
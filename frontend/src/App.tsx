import { useEffect, useState } from 'react';
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
} from '@chakra-ui/react';
import ModalCard from './components/ModalCard'; // Import the modal component
import EventForm from './components/EventForm'; // Import the EventForm component
import './App.css';
import { Resource } from './types/type';

// Define Loading Spinner Component
const Loading = () => {
  return (
    <div className="loading-container">
      <div className="loading"></div>
    </div>
  );
};

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

const App = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | undefined>(undefined);
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI modal controls
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  useEffect(() => {
    const getResources = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/resources');
        const data = await response.json();
        setResources(data);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
        setLoading(false);
      }
    };

    getResources();
  }, []);

  const handleAddEvent = () => {
    setIsEditMode(false);
    setSelectedResource(undefined); // Changed from null to undefined
    setIsFormOpen(true);
  };

  const handleEditEvent = (resource: Resource) => {
    setIsEditMode(true);
    setSelectedResource(resource);
    setIsFormOpen(true);
  };

  const handleCardClick = (resource: Resource) => {
    setSelectedResource(resource); // Set the selected resource for the modal
    onOpen(); // Open the modal
  };

  const handleFormSubmit = async (data: FormData) => {
    try {
      let response;
      if (isEditMode && selectedResource) {
        // Edit event
        response = await fetch(`http://localhost:4000/api/resources/${selectedResource.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } else {
        // Add event
        response = await fetch('http://localhost:4000/api/resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      const updatedResource = await response.json();

      if (isEditMode) {
        // Update resource in state
        setResources((prevResources) =>
          prevResources.map((res) => (res.id === updatedResource.id ? updatedResource : res))
        );
      } else {
        // Add new resource to state
        setResources((prevResources) => [...prevResources, updatedResource]);
      }

      setIsFormOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:4000/api/resources/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      // Remove resource from state
      setResources((prevResources) => prevResources.filter((res) => res.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <Loading />;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box
      minH="100vh"
      w="100vw"
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
        >
          <Heading
            fontFamily="Montserrat Alternates"
            fontWeight="700"
            as="h1"
            size="2xl"
            textAlign="center"
            mt={8}
            color="white"
          >
            Preschool Learning Resources
          </Heading>
          <Button colorScheme="teal" onClick={handleAddEvent}>
            Add Event
          </Button>
        </Box>
        {/* Responsive grid layout */}
        <SimpleGrid columns={[1, 2, 3]} spacing={10} px={6}>
          {resources.map((resource) => (
            <Box
              key={resource.id}
              position="relative"
              borderRadius="lg"
              overflow="hidden"
              bg={getRandomColor()} // Set random background color for each card
              boxShadow="lg"
              onClick={() => handleCardClick(resource)} // Handle card click to open modal
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
                {new Date(resource.eventDate).toLocaleDateString()}
              </Badge>

              {/* Image */}
              <Image
                src={resource.imageUrl}
                alt={resource.title}
                objectFit="cover"
                w="100%"
                h="150px" // Adjust this as per your design
              />

              {/* Card Content */}
              <Box p={6}>
                <Box display="flex" alignItems="baseline" mb={2}>
                  {/* Subject Tag */}
                  <Tag
                    fontFamily={'AbeeZee'}
                    fontWeight={'700'}
                    backgroundColor="blue.600"
                    color="white"
                    mr={2}
                  >
                    {resource.subject}
                  </Tag>
                  {/* Age Group Tag */}
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
                  Subject: {resource.subject}
                </Text>
                <Text
                  fontFamily={'AbeeZee'}
                  fontWeight={'600'}
                  fontSize="sm"
                  color="gray.700"
                >
                  Age Group: {resource.ageGroup}
                </Text>
                <Text
                  fontFamily={'AbeeZee'}
                  fontWeight={'600'}
                  fontSize="sm"
                  color="gray.700"
                >
                  Rating: {resource.rating}
                </Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>

        {/* Event Form Modal */}
        {isFormOpen && (
          <Modal isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} size="lg" isCentered>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{isEditMode ? 'Edit Event' : 'Add Event'}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
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
            bgColor="white"
          />
        )}
      </Container>
    </Box>
  );
};

export default App;

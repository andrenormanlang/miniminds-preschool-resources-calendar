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
  useDisclosure,
} from '@chakra-ui/react';
import ModalCard from '../src/components/ModalCard';  // Import the modal component
import './App.css';

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
  const colors = ['orange.200', 'pink.200', 'cyan.200', 'purple.200', 'blue.200', 'yellow.200', 'green.200'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const App = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);  // State for selected resource
  const { isOpen, onOpen, onClose } = useDisclosure();  // Chakra UI modal controls

  useEffect(() => {
    const getResources = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/resources');
        const data = await response.json();
        setResources(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    getResources();
  }, []);

  const handleCardClick = (resource) => {
    setSelectedResource(resource);  // Set the selected resource for the modal
    onOpen();  // Open the modal
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
        <Heading fontFamily="Montserrat Alternates" fontWeight="700" as="h1" size="2xl" textAlign="center" mt={8} mb={8} color="white">
          Preschool Learning Resources
        </Heading>

        {/* Responsive grid layout */}
        <SimpleGrid columns={[1, 2, 3]} spacing={10} px={6}>
          {resources.map((resource) => (
            <Box
              key={resource.id}
              position="relative"
              borderRadius="lg"
              overflow="hidden"
              bg={getRandomColor()}  // Set random background color for each card
              boxShadow="lg"
              onClick={() => handleCardClick(resource)}  // Handle card click to open modal
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
                h="150px"  // Adjust this as per your design
              />

              {/* Card Content */}
              <Box p={6}>
                <Box display="flex" alignItems="baseline" mb={2}>
                  {/* Subject Tag */}
                  <Tag 
                    fontFamily={'AbeeZee'}
                    fontWeight={'700'}
                    backgroundColor="blue.600" color="white" mr={2}>
                    {resource.subject}
                  </Tag>
                  {/* Age Group Tag */}
                  <Tag 
                  fontFamily={'AbeeZee'}
                  fontWeight={'700'}
                  backgroundColor="green.600" color="white">
                    {resource.ageGroup} år
                  </Tag>
                </Box>

                <Heading 
                fontFamily="Montserrat Alternates"
                fontWeight={'900'}
                as="h2" size="md" mb={2} color="blue.900">
                  {resource.title}
                </Heading>
                <Text 
                fontFamily={'AbeeZee'}
                fontWeight={'700'}
                fontSize="sm" color="gray.700">
                  Subject: {resource.subject}
                </Text>
                <Text 
                fontFamily={'AbeeZee'}
                fontWeight={'600'}
                fontSize="sm" color="gray.700">
                  Age Group: {resource.ageGroup}
                </Text>
                <Text 
                fontFamily={'AbeeZee'}
                fontWeight={'600'}
                fontSize="sm" color="gray.700">
                  Rating: {resource.rating}
                </Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>

        {/* Use the ModalCard component */}
        <ModalCard
          resource={selectedResource}
          isOpen={isOpen}
          onClose={onClose}
        />
      </Container>
    </Box>
  );
};

export default App;

import { useEffect, useState } from 'react';
import { Box, Heading, Text, SimpleGrid, Container, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure, Image } from '@chakra-ui/react';

import "./App.css"; 


// Define Loading Spinner Component
const Loading = () => {
  return <div className="loading"></div>;
};

const App = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedResource, setSelectedResource] = useState(null); // State for selected resource
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI's modal controls



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
    setSelectedResource(resource); // Set the selected resource for the modal
    onOpen(); // Open the modal
  };

  const Loading = () => {
    return (
      <div className="loading-container">
        <div className="loading"></div>
      </div>
    );
  };

  if (loading) return <Loading />
  if (error) return <p>Error: {error}</p>;

  return (
    <Container maxW={'1300px'} centerContent>
      <Heading as="h1" size="2xl" textAlign="center" mt={8} mb={8}>
        Preschool Learning Resources
      </Heading>

      {/* Responsive grid layout */}
      <SimpleGrid columns={[1, 2, 3]} spacing={10} px={6}>
        {resources.map((resource) => (
          <Box
            key={resource.id}
            p={6}
            bg="blue.100"
            borderRadius="lg"
            boxShadow="lg"
            className="resource-card"
            onClick={() => handleCardClick(resource)} // Handle card click to open modal
            cursor="pointer"
          >
            <Image 
              src={resource.imageUrl} 
              alt={resource.title} 
              borderRadius="lg"
              mb={4} // Margin bottom to separate from text
              objectFit="cover"
              maxHeight="150px" // Adjust the max height to make sure the image size is controlled
              width="100%" 
            />
            <Heading as="h2" size="md" mb={2} color="blue.900">
              {resource.title}
            </Heading>
            <Text>Subject: {resource.subject}</Text>
            <Text>Age Group: {resource.ageGroup}</Text>
            <Text>Rating: {resource.rating}</Text>
          </Box>
        ))}
      </SimpleGrid>

      {/* Modal for showing resource details */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedResource?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Image 
              src={selectedResource?.imageUrl} 
              alt={selectedResource?.title} 
              borderRadius="lg"
              mb={4} // Add margin below image in the modal
              objectFit="cover"
              maxHeight="200px"
              width="100%"
            />
            <Text mb={2}>Subject: {selectedResource?.subject}</Text>
            <Text mb={2}>Age Group: {selectedResource?.ageGroup}</Text>
            <Text mb={2}>Rating: {selectedResource?.rating}</Text>
            <Text mb={4}>Description: {selectedResource?.description}</Text>
            <Text>Date: {new Date(selectedResource?.eventDate).toLocaleDateString()}</Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default App;


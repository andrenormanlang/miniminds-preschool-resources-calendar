import {
    Box,
    Heading,
    Text,
    Image,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton,
    Badge,
  } from '@chakra-ui/react';
  
  const ModalCard = ({ resource, isOpen, onClose, bgColor }) => {
    if (!resource) return null; // Return null if no resource is selected
  
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="lg" isCentered>
        <ModalOverlay />
        <ModalContent
          borderRadius="lg" // Adding border radius to the modal
          bg={bgColor} // Dynamic background color for modal body
          color="white"
          boxShadow="2xl"
          overflow="hidden"
          p={0}
        >
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
             
            size="lg" textAlign="center" mb={4} color="white">
              {resource.title}
            </Heading>
  
            {/* Card Body */}
            <ModalBody p={0}>
              <Box mb={4}>
                {/* Subject and Age Group */}
                <Text 
                fontFamily={'Montserrat Alternates'}
                
                fontSize="lg" fontWeight="bold" color="yellow.300" mb={2}>
                   {resource.subject}
                </Text>
                <Text 
                fontFamily={'AbeeZee'}
                fontSize="lg" color="yellow.100" mb={2}>
                  Age Group: {resource.ageGroup}
                </Text>
  
                {/* Rating */}
                <Text 
                fontFamily={'Montserrat Alternates'}
                fontSize="lg" fontWeight="bold" color="yellow.300" mb={2}>
                  Rating: {resource.rating}
                </Text>
  
                {/* Description */}
                <Text 
                fontFamily={'AbeeZee'}
                mt={4} fontSize="md" color="gray.100" lineHeight="1.8">
                   {resource.description}
                </Text>
  
                
              </Box>
            </ModalBody>
          </Box>
        </ModalContent>
      </Modal>
    );
  };
  
  export default ModalCard;
  
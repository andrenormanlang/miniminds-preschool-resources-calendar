import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Box,
  Image,
  Flex,
  Badge,
  Divider
} from '@chakra-ui/react';
import { Resource } from '../types/type';
import { useResourceApproval } from '../contexts/ResourceApprovalContext';

interface ResourceApprovalModalProps {
  resource: Resource;
  isOpen: boolean;
  onClose: () => void;
  onApproved: () => void;
  onRejected: () => void;
}

const ResourceApprovalModal: React.FC<ResourceApprovalModalProps> = ({ 
  resource, 
  isOpen, 
  onClose, 
  onApproved,
  onRejected
}) => {
  const { approveResource, rejectResource, isProcessing } = useResourceApproval();
  
  const handleApprove = async () => {
    const success = await approveResource(resource.id);
    if (success) {
      onApproved();
      onClose();
    }
  };
  
  const handleReject = async () => {
    const success = await rejectResource(resource.id);
    if (success) {
      onRejected();
      onClose();
    }
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Resource Approval</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Box mb={4}>
            {resource.imageUrl && (
              <Image 
                src={resource.imageUrl} 
                alt={resource.title} 
                borderRadius="md" 
                height="200px" 
                width="100%" 
                objectFit="cover" 
                mb={4}
              />
            )}
            
            <Flex justifyContent="space-between" alignItems="center" mb={2}>
              <Text fontSize="xl" fontWeight="bold">{resource.title}</Text>
              <Badge colorScheme="yellow">Pending Approval</Badge>
            </Flex>
            
            <Divider my={3} />
            
            <Flex wrap="wrap" gap={2} mb={3}>
              <Badge colorScheme="blue">{resource.subject}</Badge>
              <Badge colorScheme="green">Age: {resource.ageGroup}</Badge>
              <Badge colorScheme="purple">Rating: {resource.rating}/5</Badge>
            </Flex>
            
            <Text fontWeight="bold" mb={1}>Description:</Text>
            <Text mb={3}>{resource.description}</Text>
            
            <Text fontWeight="bold" mb={1}>Event Date:</Text>
            <Text>{new Date(resource.eventDate).toLocaleDateString()}</Text>
          </Box>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button 
            colorScheme="red" 
            onClick={handleReject} 
            isLoading={isProcessing}
          >
            Reject
          </Button>
          <Button 
            colorScheme="green" 
            onClick={handleApprove} 
            isLoading={isProcessing}
          >
            Approve
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ResourceApprovalModal;
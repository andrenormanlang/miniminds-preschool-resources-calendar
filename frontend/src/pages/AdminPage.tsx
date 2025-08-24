import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  useToast,
  Text,
  useDisclosure,
  Flex,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import Loading from "../components/Loading";
import { Resource } from "../types/type";
import EventForm from "../components/EventForm";
import { FaEdit, FaTrash, FaEye, FaPlus } from "react-icons/fa";
import ModalCard from "../components/ModalCard";
import { useAuthFetch } from "../utils/authUtils";

type FormData = {
  title: string;
  type: string;
  subject: string;
  ageGroup: string;
  description: string;
  eventDate: string;
  imageUrl: string;
};

const AdminPage = () => {
  const [userResources, setUserResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(
    null
  );
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { user, isSignedIn } = useUser();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { authFetch } = useAuthFetch();

  useEffect(() => {
    if (isSignedIn) {
      fetchUserResources();
    }
  }, [isSignedIn]);

  // For example, in AdminPage.tsx
  // Replace your existing fetchUserResources with this:
  const fetchUserResources = async () => {
    try {
      const data = await authFetch(
        "/api/resources/admin/mine"
      );
      setUserResources(data);
    } catch (error) {
      console.error("Failed to fetch resources:", error);
      toast({
        title: "Error fetching resources",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddResource = () => {
    setIsEditMode(false);
    setSelectedResource(null);
    setIsFormOpen(true);
  };

  const handleEditResource = (resource: Resource) => {
    setIsEditMode(true);
    setSelectedResource(resource);
    setIsFormOpen(true);
  };

  const handleViewResource = (resource: Resource) => {
    setSelectedResource(resource);
    onOpen();
  };

  const handleDeleteResource = async (resourceId: number) => {
    try {
      await authFetch(`/api/resources/${resourceId}`, {
        method: "DELETE",
      });

      // Remove resource from the list
      setUserResources(userResources.filter((r) => r.id !== resourceId));

      toast({
        title: "Resource deleted",
        status: "success",
        duration: 3000,
      });

      onClose(); // Close modal if open
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to delete resource",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    try {
      let updatedResource;

      if (isEditMode && selectedResource) {
        // Update existing resource
        updatedResource = await authFetch(
          `http://localhost:4000/api/resources/${selectedResource.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
      } else {
        // Create new resource
        updatedResource = await authFetch(
          "http://localhost:4000/api/resources",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );
      }

      if (isEditMode) {
        setUserResources((resources) =>
          resources.map((r) =>
            r.id === updatedResource.id ? updatedResource : r
          )
        );
        toast({
          title: "Resource updated",
          description: "Your changes have been saved",
          status: "success",
          duration: 3000,
        });
      } else {
        setUserResources((resources) => [...resources, updatedResource]);
        toast({
          title: "Resource created",
          description: "Your resource is pending approval",
          status: "success",
          duration: 3000,
        });
      }

      setIsFormOpen(false);
      fetchUserResources(); // Refresh the list
    } catch (error) {
      console.error(error);
      toast({
        title: "Error saving resource",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box p={8}>
      <Heading mb={6} color="blue.700">
        Admin Dashboard
      </Heading>

      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="md">Your Resources</Heading>
        <Button
          leftIcon={<Icon as={FaPlus} />}
          colorScheme="blue"
          onClick={handleAddResource}
        >
          Add New Resource
        </Button>
      </Flex>

      {userResources.length > 0 ? (
        <Box overflowX="auto">
          <Table variant="simple" colorScheme="blue">
            <Thead bg="blue.50">
              <Tr>
                <Th>Title</Th>
                <Th>Subject</Th>
                <Th>Age Group</Th>
                <Th>Date</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {userResources.map((resource) => (
                <Tr key={resource.id}>
                  <Td fontWeight="medium">{resource.title}</Td>
                  <Td>{resource.subject}</Td>
                  <Td>{resource.ageGroup}</Td>
                  <Td>{new Date(resource.eventDate).toLocaleDateString()}</Td>
                  <Td>
                    <Badge
                      colorScheme={resource.isApproved ? "green" : "yellow"}
                      px={2}
                      py={1}
                      borderRadius="md"
                    >
                      {resource.isApproved ? "Approved" : "Pending"}
                    </Badge>
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      <Button
                        size="sm"
                        colorScheme="teal"
                        leftIcon={<Icon as={FaEye} />}
                        onClick={() => handleViewResource(resource)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="blue"
                        leftIcon={<Icon as={FaEdit} />}
                        onClick={() => handleEditResource(resource)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        leftIcon={<Icon as={FaTrash} />}
                        onClick={() => handleDeleteResource(resource.id)}
                      >
                        Delete
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      ) : (
        <Box textAlign="center" p={6} bg="gray.50" borderRadius="md">
          <Text fontSize="lg" mb={4}>
            You haven't created any resources yet
          </Text>
          <Button colorScheme="blue" onClick={handleAddResource}>
            Create Your First Resource
          </Button>
        </Box>
      )}

      {/* Resource Form Modal */}
      {isFormOpen && (
        <Modal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          size="lg"
          isCentered
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {isEditMode ? "Edit Resource" : "Create New Resource"}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <EventForm
                resource={selectedResource || undefined}
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
          onEdit={() => handleEditResource(selectedResource)}
          onDelete={() => handleDeleteResource(selectedResource.id)}
          canEdit={true}
          canDelete={true}
        />
      )}
    </Box>
  );
};

export default AdminPage;

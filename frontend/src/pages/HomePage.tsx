import React, { useState, useEffect, useMemo } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Box,
  Text,
  SimpleGrid,
  Container,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {  useNavigate } from "react-router-dom";
import { Resource } from "../types/type";
import Loading from "../components/Loading";
import { useResourceApi } from "../services/api";
import ResourceCard from "../components/ResourceCard";
import ResourceFilters from "../components/ResourceFilters";
import ModalCard from "../components/ModalCard";

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

const HomePage: React.FC = () => {
  const { isSignedIn } = useUser();
  const [selectedResource, setSelectedResource] = useState<
    Resource | undefined
  >();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const resourceApi = useResourceApi();
  const [resourceColors, setResourceColors] = useState<Record<number, string>>(
    {}
  );

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Queries
  const { data: allResources = [], isLoading: isLoadingAllResources } =
    useQuery({
      queryKey: ["resources", "all"],
      queryFn: resourceApi.getAllResources,
    });

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: resourceApi.getCurrentUser,
    enabled: isSignedIn,
  });

  // Filter resources based on approval status for regular users
  const resources = useMemo(() => {
    let resourceList = [...allResources];
    if (currentUser?.role === "user") {
      resourceList = resourceList.filter((resource) => resource.isApproved);
    }
    return resourceList.sort(
      (a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    );
  }, [allResources, currentUser]);

  // Enhanced resources filtering and sorting
  const filteredAndSortedResources = useMemo(() => {
    let filtered = [...resources];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(query) ||
          resource.description.toLowerCase().includes(query)
      );
    }

    // Only apply additional filters for admin/superAdmin
    if (currentUser?.role !== "user") {
      // Apply type filter
      if (selectedType !== "all") {
        filtered = filtered.filter(
          (resource) => resource.type === selectedType
        );
      }

      // Apply subject filter
      if (selectedSubject !== "all") {
        filtered = filtered.filter(
          (resource) => resource.subject === selectedSubject
        );
      }

      // Apply age group filter
      if (selectedAgeGroup !== "all") {
        filtered = filtered.filter(
          (resource) => resource.ageGroup === selectedAgeGroup
        );
      }

      // Apply date range filter
      if (startDate || endDate) {
        filtered = filtered.filter((resource) => {
          const resourceDate = new Date(resource.eventDate);
          if (startDate && endDate) {
            return (
              resourceDate >= new Date(startDate) &&
              resourceDate <= new Date(endDate)
            );
          } else if (startDate) {
            return resourceDate >= new Date(startDate);
          } else if (endDate) {
            return resourceDate <= new Date(endDate);
          }
          return true;
        });
      }
    }

    return filtered.sort(
      (a, b) =>
        new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime()
    );
  }, [
    resources,
    searchQuery,
    selectedType,
    selectedSubject,
    selectedAgeGroup,
    startDate,
    endDate,
    currentUser?.role,
  ]);

  // Get unique values for filters
  const filterOptions = useMemo(() => {
    const types = new Set<string>();
    const subjects = new Set<string>();
    const ageGroups = new Set<string>();

    resources.forEach((resource) => {
      types.add(resource.type);
      subjects.add(resource.subject);
      ageGroups.add(resource.ageGroup);
    });

    return {
      types: Array.from(types),
      subjects: Array.from(subjects),
      ageGroups: Array.from(ageGroups),
    };
  }, [resources]);

  // Mutations
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
    const newColors: Record<number, string> = {};
    resources.forEach((resource) => {
      if (!resourceColors[resource.id]) {
        newColors[resource.id] = getRandomColor();
      }
    });
    if (Object.keys(newColors).length > 0) {
      setResourceColors((prev) => ({ ...prev, ...newColors }));
    }
  }, [resources, resourceColors]);

  const handleCardClick = (resource: Resource) => {
    setSelectedResource(resource);
    onOpen();
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
  const canEditResource = (resource: Resource) => {
    if (!isSignedIn || !currentUser?.role) return false;
    if (currentUser.role === "superAdmin") return true;
    if (currentUser.role === "admin") {
      return resource.userId === currentUser.id;
    }
    return false;
  };

  const canDeleteResource = canEditResource;

  if (isLoadingAllResources) return <Loading />;

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
        <ResourceFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedSubject={selectedSubject}
          setSelectedSubject={setSelectedSubject}
          selectedAgeGroup={selectedAgeGroup}
          setSelectedAgeGroup={setSelectedAgeGroup}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          filterOptions={filterOptions}
          showAllFilters={currentUser?.role !== "user"}
        />

        <Box position="relative" zIndex="1" w="100%">
          {isLoadingAllResources ? (
            <Box textAlign="center" py={10}>
              <Spinner size="xl" color="white" />
              <Text mt={4} color="white" fontSize="lg">
                Loading resources...
              </Text>
            </Box>
          ) : filteredAndSortedResources.length > 0 ? (
            <SimpleGrid
              columns={{ base: 1, sm: 2, md: 3, lg: 4 }}
              spacing={6}
              mt={8}
            >
              {filteredAndSortedResources.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  resource={resource}
                  backgroundColor={resourceColors[resource.id] || "white"}
                  onCardClick={handleCardClick}
                  onEdit={() => navigate(`/edit/${resource.id}`)}
                  onDelete={handleDeleteEvent}
                  canEdit={canEditResource(resource)}
                  canDelete={canDeleteResource(resource)}
                  showApprovalStatus={currentUser?.role !== "user"}
                />
              ))}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py={10}>
              <Text fontSize="xl" color="white">
                {searchQuery
                  ? "No resources found matching your search."
                  : "No resources available."}
              </Text>
            </Box>
          )}
        </Box>
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
                onEdit={() => navigate(`/edit/${selectedResource.id}`)}
                onDelete={() => handleDeleteEvent(selectedResource.id)}
                canEdit={canEditResource(selectedResource)}
                canDelete={canDeleteResource(selectedResource)}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default HomePage;

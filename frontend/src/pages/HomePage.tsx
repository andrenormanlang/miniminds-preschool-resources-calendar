import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Box,
  Text,
  SimpleGrid,
  Container,
  Button,
  useDisclosure,
  Modal,
  ModalContent,
  ModalCloseButton,
  ModalBody,

  useToast,

  VStack,
  
  Icon,

  ModalOverlay,
  ModalHeader,
  useBreakpointValue,
  HStack,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import ModalCard from "../components/ModalCard";
import EventForm from "../components/EventForm";
import ResourceCard from "../components/ResourceCard";
import MobileSearchFilter from "../components/MobileSearchFilter";
import { EventFormData, Resource } from "../types/type";
import Loading from "../components/Loading";
import { useResourceApi } from "../services/api";
import { FaBookOpen } from "react-icons/fa";
import FloatingAIButton from "../components/FloatingAIButton";

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


const swedishHolidays2025 = ["2025-11-01"];

const isValidDate = (date: Date) => {
  const dayOfWeek = date.getDay();
  const isWeekday = dayOfWeek > 0 && dayOfWeek < 6;
  const dateStr = date.toISOString().split("T")[0];
  const isHoliday = swedishHolidays2025.includes(dateStr);
  return isWeekday && !isHoliday;
};

const getNextValidDate = (date: Date, direction: number) => {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + direction);
  while (!isValidDate(nextDate)) {
    nextDate.setDate(nextDate.getDate() + direction);
  }
  return nextDate;
};

const HomePage = () => {
  const { isSignedIn } = useUser();
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
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Only show filter options for admin/superAdmin
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("all");

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false });
  const gridColumns = useBreakpointValue({
    base: 1,
    sm: 2,
    md: 2,
    lg: 3,
    xl: 4,
  });

  




  // Updated Queries
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
  const resources = React.useMemo(() => {
    let resourceList = [...allResources];

    // For regular users, only show approved resources
    if (currentUser?.role === "user") {
      resourceList = resourceList.filter((resource) => resource.isApproved);
    }

    return resourceList.sort((a, b) => {
      return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
    });
  }, [allResources, currentUser]);

  // Enhanced resources filtering and sorting
  const filteredAndSortedResources = React.useMemo(() => {
    let filtered = [...resources];

    // Filter out events that have already passed (only show current and future events)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison
    filtered = filtered.filter((resource) => {
      const eventDate = new Date(resource.eventDate);
      eventDate.setHours(0, 0, 0, 0); // Set to beginning of day for accurate comparison
      return eventDate >= today;
    });

    // Check URL parameters for filter=mine
    const filterParam = searchParams.get("filter");
    if (filterParam === "mine" && currentUser) {
      filtered = filtered.filter(
        (resource) => resource.userId === currentUser.id
      );
    }

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

    // Sort by date ascending by default
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
    currentUser,
    searchParams,
  ]);



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
    onError: (error) => {
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
      setSelectedResource(undefined);
    },
    onError: (error) => {
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
    onError: (error) => {
      toast({
        title: "Error deleting resource",
        description: error.message,
        status: "error",
        duration: 5000,
      });
    },
  });

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedType("all");
    setSelectedSubject("all");
    setSelectedAgeGroup("all");
    setStartDate("");
    setEndDate("");
  };

  // Effect to handle resource colors - moved outside of render
  useEffect(() => {
    if (filteredAndSortedResources.length > 0) {
      const newColors: Record<number, string> = {};
      filteredAndSortedResources.forEach((resource) => {
        if (!resourceColors[resource.id]) {
          newColors[resource.id] = getRandomColor();
        }
      });
      if (Object.keys(newColors).length > 0) {
        setResourceColors((prev) => ({ ...prev, ...newColors }));
      }
    }
  }, [filteredAndSortedResources, resourceColors]);

  // Check for URL parameter to auto-open add resource form
  useEffect(() => {
    const addResourceParam = searchParams.get("addResource");
    if (addResourceParam === "true") {
      setIsFormOpen(true);
      // Remove the parameter from URL
      navigate(location.pathname, { replace: true });
    }
  }, [searchParams, navigate, location.pathname]);

  const handleEditEvent = (resource: Resource) => {
    setSelectedResource(resource);
    setIsEditMode(true);
    setIsFormOpen(true);
    onClose();
  };

  const handleFormSubmit = (data: EventFormData) => {
    if (!isSignedIn) {
      toast({
        title: "Error",
        description: "You must be logged in to create resources",
        status: "error",
        duration: 5000,
      });
      return;
    }

    // Ensure the date is in ISO format
    const isoFormattedDate = new Date(data.eventDate).toISOString();

    // Create a payload that matches what your API expects
    const payload = {
      ...data,
      eventDate: isoFormattedDate,
      isApproved: false, // Default value for new resources
    };

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


  const canEditResource = (resource: Resource) => {
    if (!isSignedIn || !currentUser?.role) return false;
    if (currentUser.role === "superAdmin") return true;
    if (currentUser.role === "admin") {
      return resource.userId === currentUser.id;
    }
    return false;
  };

  const canDeleteResource = canEditResource;

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination || destination.index === source.index) {
      return;
    }

    const items = Array.from(filteredAndSortedResources);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    const updatedResource = filteredAndSortedResources.find(
      (r) => r.id === parseInt(draggableId)
    );

    if (updatedResource) {
      let newEventDate: Date;

      const itemAfter = items[destination.index + 1];
      const itemBefore = items[destination.index - 1];

      if (itemAfter) {
        // If there's a card after the drop position, set date to 1 day before it.
        newEventDate = getNextValidDate(new Date(itemAfter.eventDate), -1);
      } else if (itemBefore) {
        // If it's dropped at the end, set date to 1 day after the card before it.
        newEventDate = getNextValidDate(new Date(itemBefore.eventDate), 1);
      } else {
        // Should not happen in a list with more than one item, but as a fallback:
        return;
      }

      const {  ...rest } = updatedResource;
      updateResourceMutation.mutate(
        {
          id: updatedResource.id,
          data: {
            ...rest,
            eventDate: newEventDate.toISOString(),
          },
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["resources"] });
            toast({
              title: "Resource date updated!",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
          },
        }
      );
    }
  };


  if (isLoadingAllResources) return <Loading />;

  return (
    <Box
      minH="calc(100vh - 60px)"
      w="100%"
      position="relative"
      bg="gray.50"
      px={{ base: 2, md: 4 }}
      py={{ base: 4, md: 6 }}
    >
      <Container
        maxW={{ base: "100%", md: "1200px", lg: "1400px" }}
        centerContent={false}
        px={{ base: 2, md: 4 }}
      >
        {/* Page Header */}
        <VStack
          spacing={{ base: 4, md: 6 }}
          align="stretch"
          mb={{ base: 4, md: 6 }}
        >
          <Box textAlign="center">
            <Text
              fontSize={{ base: "2xl", md: "3xl", lg: "4xl" }}
              fontWeight="bold"
              color="purple.700"
              mb={2}
            >
              Educational Resources
            </Text>
          </Box>

          {/* Mobile-Responsive Search and Filter */}
          <MobileSearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            selectedSubject={selectedSubject}
            onSubjectChange={setSelectedSubject}
            selectedAgeGroup={selectedAgeGroup}
            onAgeGroupChange={setSelectedAgeGroup}
            startDate={startDate}
            onStartDateChange={setStartDate}
            endDate={endDate}
            onEndDateChange={setEndDate}
            onClearFilters={clearAllFilters}
            userRole={currentUser?.role}
          />

          {/* Results Count */}
          <HStack justify="space-between" align="center">
            <Text fontSize={{ base: "sm", md: "md" }} color="gray.600">
              {filteredAndSortedResources.length} resource
              {filteredAndSortedResources.length !== 1 ? "s" : ""} found
            </Text>
            {currentUser?.role !== "user" && (
              <Text fontSize="xs" color="gray.500">
                {isMobile ? "Tap to view" : "Click to view details"}
              </Text>
            )}
          </HStack>
        </VStack>

        {/* Resources Grid */}
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="resources" direction="vertical">
            {(provided) => (
              <Box
                ref={provided.innerRef}
                {...provided.droppableProps}
                minH="200px"
                position="relative"
              >
                {filteredAndSortedResources.length > 0 ? (
                  <SimpleGrid
                    columns={gridColumns}
                    spacing={{ base: 3, md: 4, lg: 6 }}
                    w="100%"
                  >
                    {filteredAndSortedResources.map((resource, index) => {
                      return (
                        <Draggable
                          key={resource.id}
                          draggableId={String(resource.id)}
                          index={index}
                          isDragDisabled={currentUser?.role === "user"}
                        >
                          {(provided, snapshot) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              height="100%"
                            >
                              <ResourceCard
                                resource={resource}
                                bgColor={resourceColors[resource.id] || "white"}
                                canEdit={canEditResource(resource)}
                                canDelete={canDeleteResource(resource)}
                                onEdit={() => handleEditEvent(resource)}
                                onDelete={() => handleDeleteEvent(resource.id)}
                                onClick={() => {
                                  setSelectedResource(resource);
                                  onOpen();
                                }}
                                isDragging={snapshot.isDragging}
                              />
                            </Box>
                          )}
                        </Draggable>
                      );
                    })}
                    {provided.placeholder}
                  </SimpleGrid>
                ) : (
                  <Box textAlign="center" py={{ base: 8, md: 12 }} px={4}>
                    <VStack spacing={4}>
                      <Icon
                        as={FaBookOpen}
                        boxSize={{ base: 12, md: 16 }}
                        color="gray.400"
                      />
                      <Text
                        fontSize={{ base: "lg", md: "xl" }}
                        color="gray.600"
                        fontWeight="medium"
                      >
                        {searchQuery
                          ? "No resources found matching your search."
                          : "No resources available."}
                      </Text>
                      {searchQuery && (
                        <Button
                          variant="outline"
                          colorScheme="purple"
                          onClick={() => setSearchQuery("")}
                          size={{ base: "sm", md: "md" }}
                        >
                          Clear Search
                        </Button>
                      )}
                    </VStack>
                  </Box>
                )}
              </Box>
            )}
          </Droppable>
        </DragDropContext>
      </Container>

      {/* Resource Detail Modal */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size={{ base: "full", md: "xl" }}
        scrollBehavior="inside"
        isCentered={!isMobile}
      >
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent
          maxW={{ base: "100%", md: "800px" }}
          borderRadius={{ base: 0, md: "lg" }}
          boxShadow="2xl"
          mx={{ base: 0, md: 4 }}
          my={{ base: 0, md: 4 }}
          maxH={{ base: "100vh", md: "90vh" }}
        >
          <ModalHeader
            pb={2}
            fontSize={{ base: "lg", md: "2xl" }}
            borderBottom="1px solid"
            borderColor="gray.200"
            px={{ base: 4, md: 6 }}
            pt={{ base: 4, md: 6 }}
          >
            {selectedResource?.title}
          </ModalHeader>
          <ModalCloseButton
            size={{ base: "md", md: "lg" }}
            top={{ base: 4, md: 6 }}
            right={{ base: 4, md: 6 }}
          />
          <ModalBody py={4} px={{ base: 4, md: 6 }}>
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
        size={{ base: "full", md: "xl" }}
        scrollBehavior="inside"
        isCentered={!isMobile}
      >
        <ModalOverlay backdropFilter="blur(2px)" />
        <ModalContent
          maxW={{ base: "100%", md: "800px" }}
          borderRadius={{ base: 0, md: "lg" }}
          mx={{ base: 0, md: 4 }}
          my={{ base: 0, md: 4 }}
          maxH={{ base: "100vh", md: "90vh" }}
        >
          <ModalHeader
            fontSize={{ base: "lg", md: "xl" }}
            px={{ base: 4, md: 6 }}
            pt={{ base: 4, md: 6 }}
          >
            {isEditMode ? "Edit Resource" : "Add New Resource"}
          </ModalHeader>
          <ModalCloseButton
            size={{ base: "md", md: "lg" }}
            top={{ base: 4, md: 6 }}
            right={{ base: 4, md: 6 }}
          />
          <ModalBody pb={6} px={{ base: 4, md: 6 }}>
            <EventForm
              resource={selectedResource}
              onSubmit={handleFormSubmit}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* AI Assistant Floating Button */}
      <FloatingAIButton />
    </Box>
  );
};

export default HomePage;

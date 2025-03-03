import React, { useState, useEffect } from "react";
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
  ButtonGroup,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  useToast,
  Spinner,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Select,
  HStack,
  VStack,
  Grid,
  GridItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverHeader,
  PopoverCloseButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Stack,
} from "@chakra-ui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  EditIcon,
  DeleteIcon,
  SearchIcon,
  ChevronDownIcon,
  TimeIcon,
  SunIcon,
  CalendarIcon,
} from "@chakra-ui/icons";
import ModalCard from "../components/ModalCard";
import EventForm from "../components/EventForm";
import { Resource } from "../types/type";
import Loading from "../components/Loading";
import { useResourceApi } from "../services/api";
import {
  FaFilter,
  FaSort,
  FaBookOpen,
  FaUsers,
  FaGraduationCap,
} from "react-icons/fa";

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

// Add a date formatting function
const formatCardDate = (dateString: string) => {
  const date = new Date(dateString);
  // Format as "29 April" (day and month name)
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
  });
};

const HomePage = () => {
  const { user, isSignedIn } = useUser();
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
  const filter = (searchParams.get("filter") as "all" | "mine") || "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [selectedAgeGroup, setSelectedAgeGroup] = useState("all");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  // Updated Queries
  const { data: allResources = [], isLoading: isLoadingAllResources } =
    useQuery({
      queryKey: ["resources", "all"],
      queryFn: resourceApi.getAllResources,
      enabled: filter === "all",
    });

  const { data: userResources = [], isLoading: isLoadingUserResources } =
    useQuery({
      queryKey: ["resources", "mine"],
      queryFn: resourceApi.getUserResources,
      enabled: filter === "mine" && isSignedIn,
    });

  const { data: currentUser } = useQuery({
    queryKey: ["currentUser"],
    queryFn: resourceApi.getCurrentUser,
    enabled: isSignedIn,
  });

  // Combine and sort resources based on filter
  const resources = React.useMemo(() => {
    const resourceList = filter === "all" ? allResources : userResources;
    return [...resourceList].sort((a, b) => {
      return new Date(a.eventDate).getTime() - new Date(b.eventDate).getTime();
    });
  }, [filter, allResources, userResources]);

  // Enhanced resources filtering and sorting
  const filteredAndSortedResources = React.useMemo(() => {
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

    // Apply type filter
    if (selectedType !== "all") {
      filtered = filtered.filter((resource) => resource.type === selectedType);
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
  ]);

  // Get unique values for filters
  const filterOptions = React.useMemo(() => {
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
    onError: (error: Error) => {
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
    },
    onError: (error: Error) => {
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
    if (resources.length > 0) {
      const newColors: Record<number, string> = {};
      resources.forEach((resource) => {
        if (!resourceColors[resource.id]) {
          newColors[resource.id] = getRandomColor();
        }
      });
      if (Object.keys(newColors).length > 0) {
        setResourceColors((prev) => ({ ...prev, ...newColors }));
      }
    }
  }, [resources]);

  // Effect to handle add resource from URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("addResource") === "true" && canAddResource()) {
      handleAddEvent();
      navigate("/", { replace: true });
    }
  }, [location.search]);

  const handleAddEvent = () => {
    setSelectedResource(undefined);
    setIsEditMode(false);
    setIsFormOpen(true);
  };

  const handleEditEvent = (resource: Resource) => {
    setSelectedResource(resource);
    setIsEditMode(true);
    setIsFormOpen(true);
    onClose();
  };

  const handleCardClick = (resource: Resource) => {
    setSelectedResource(resource);
    onOpen();
  };

  const handleFormSubmit = async (data: Omit<Resource, "id">) => {
    const isoFormattedDate = new Date(data.eventDate).toISOString();
    const payload = { ...data, eventDate: isoFormattedDate };

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
  const canAddResource = () => {
    if (!currentUser) return false;
    return currentUser.role === "admin" || currentUser.role === "superAdmin";
  };

  const canEditResource = (resource: Resource) => {
    if (!isSignedIn || !currentUser?.role) return false;
    if (currentUser.role === "superAdmin") return true;
    if (currentUser.role === "admin") {
      return resource.userId === currentUser.id;
    }
    return false;
  };

  const canDeleteResource = canEditResource;

  const renderApprovalStatus = (resource: Resource) => {
    if (!isSignedIn || !currentUser) return null;
    if (!currentUser.role || currentUser.role === "user") return null;

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

  if (isLoadingAllResources || isLoadingUserResources) return <Loading />;

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
        {/* Search and Filters Section */}
        <Grid
          templateColumns={{
            base: "1fr",
            md: "repeat(2, 1fr)",
            lg: "repeat(3, 1fr)",
          }}
          gap={4}
          w="100%"
          mb={8}
          p={4}
          bg="whiteAlpha.200"
          borderRadius="xl"
          backdropFilter="blur(10px)"
          position="relative"
          zIndex="10"
          boxShadow="xl"
        >
          {/* Search Bar - Full Width */}
          <GridItem colSpan={{ base: 1, md: 2, lg: 3 }}>
            <InputGroup size="lg" position="relative" zIndex="11">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="purple.300" />
              </InputLeftElement>
              <Input
                placeholder="Search resources..."
                bg="white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                _focus={{
                  borderColor: "purple.300",
                  boxShadow: "0 0 0 1px purple.300",
                }}
              />
            </InputGroup>
          </GridItem>

          {/* Type Filter */}
          <GridItem position="relative" zIndex="12">
            <Popover placement="bottom-start" gutter={4}>
              <PopoverTrigger>
                <Button
                  w="100%"
                  rightIcon={<ChevronDownIcon />}
                  leftIcon={<Icon as={FaBookOpen} />}
                  variant="solid"
                  bg={selectedType !== "all" ? "purple.500" : "white"}
                  color={selectedType !== "all" ? "white" : "gray.800"}
                  _hover={{
                    bg: selectedType !== "all" ? "purple.600" : "gray.100",
                  }}
                >
                  {selectedType === "all" ? "All Types" : selectedType}
                </Button>
              </PopoverTrigger>
              <PopoverContent zIndex="1000">
                <PopoverArrow />
                <PopoverBody>
                  <VStack align="stretch" spacing={2}>
                    <Button
                      variant="ghost"
                      justifyContent="flex-start"
                      isActive={selectedType === "all"}
                      onClick={() => setSelectedType("all")}
                    >
                      All Types
                    </Button>
                    {filterOptions.types.map((type) => (
                      <Button
                        key={type}
                        variant="ghost"
                        justifyContent="flex-start"
                        isActive={selectedType === type}
                        onClick={() => setSelectedType(type)}
                      >
                        {type}
                      </Button>
                    ))}
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </GridItem>

          {/* Subject Filter */}
          <GridItem position="relative" zIndex="12">
            <Popover placement="bottom-start" gutter={4}>
              <PopoverTrigger>
                <Button
                  w="100%"
                  rightIcon={<ChevronDownIcon />}
                  leftIcon={<Icon as={FaGraduationCap} />}
                  variant="solid"
                  bg={selectedSubject !== "all" ? "teal.500" : "white"}
                  color={selectedSubject !== "all" ? "white" : "gray.800"}
                  _hover={{
                    bg: selectedSubject !== "all" ? "teal.600" : "gray.100",
                  }}
                >
                  {selectedSubject === "all" ? "All Subjects" : selectedSubject}
                </Button>
              </PopoverTrigger>
              <PopoverContent zIndex="1000">
                <PopoverArrow />
                <PopoverBody>
                  <VStack align="stretch" spacing={2}>
                    <Button
                      variant="ghost"
                      justifyContent="flex-start"
                      isActive={selectedSubject === "all"}
                      onClick={() => setSelectedSubject("all")}
                    >
                      All Subjects
                    </Button>
                    {filterOptions.subjects.map((subject) => (
                      <Button
                        key={subject}
                        variant="ghost"
                        justifyContent="flex-start"
                        isActive={selectedSubject === subject}
                        onClick={() => setSelectedSubject(subject)}
                      >
                        {subject}
                      </Button>
                    ))}
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </GridItem>

          {/* Age Group Filter */}
          <GridItem position="relative" zIndex="12">
            <Popover placement="bottom-start" gutter={4}>
              <PopoverTrigger>
                <Button
                  w="100%"
                  rightIcon={<ChevronDownIcon />}
                  leftIcon={<Icon as={FaUsers} />}
                  variant="solid"
                  bg={selectedAgeGroup !== "all" ? "orange.500" : "white"}
                  color={selectedAgeGroup !== "all" ? "white" : "gray.800"}
                  _hover={{
                    bg: selectedAgeGroup !== "all" ? "orange.600" : "gray.100",
                  }}
                >
                  {selectedAgeGroup === "all"
                    ? "All Age Groups"
                    : selectedAgeGroup}
                </Button>
              </PopoverTrigger>
              <PopoverContent zIndex="1000">
                <PopoverArrow />
                <PopoverBody>
                  <VStack align="stretch" spacing={2}>
                    <Button
                      variant="ghost"
                      justifyContent="flex-start"
                      isActive={selectedAgeGroup === "all"}
                      onClick={() => setSelectedAgeGroup("all")}
                    >
                      All Age Groups
                    </Button>
                    {filterOptions.ageGroups.map((ageGroup) => (
                      <Button
                        key={ageGroup}
                        variant="ghost"
                        justifyContent="flex-start"
                        isActive={selectedAgeGroup === ageGroup}
                        onClick={() => setSelectedAgeGroup(ageGroup)}
                      >
                        {ageGroup}
                      </Button>
                    ))}
                  </VStack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </GridItem>

          {/* Replace Sort Options with Date Range Filter */}
          <GridItem
            colSpan={{ base: 1, md: 2, lg: 3 }}
            position="relative"
            zIndex="11"
          >
            <Popover placement="bottom">
              <PopoverTrigger>
                <Button
                  w="100%"
                  rightIcon={<ChevronDownIcon />}
                  leftIcon={<CalendarIcon />}
                  variant="solid"
                  bg={startDate || endDate ? "blue.500" : "white"}
                  color={startDate || endDate ? "white" : "gray.800"}
                  _hover={{
                    bg: startDate || endDate ? "blue.600" : "gray.100",
                  }}
                >
                  {startDate || endDate
                    ? `Date Range: ${
                        startDate
                          ? new Date(startDate).toLocaleDateString()
                          : "Any"
                      } - ${
                        endDate ? new Date(endDate).toLocaleDateString() : "Any"
                      }`
                    : "Filter by Date Range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent p={4} w="300px">
                <PopoverArrow />
                <PopoverCloseButton />
                <PopoverHeader fontWeight="bold">
                  Select Date Range
                </PopoverHeader>
                <PopoverBody>
                  <Stack spacing={4}>
                    <Box>
                      <Text fontSize="sm" mb={1}>
                        Start Date
                      </Text>
                      <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        max={endDate || undefined}
                      />
                    </Box>
                    <Box>
                      <Text fontSize="sm" mb={1}>
                        End Date
                      </Text>
                      <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || undefined}
                      />
                    </Box>
                    <Button
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => {
                        setStartDate("");
                        setEndDate("");
                      }}
                      leftIcon={<Icon as={DeleteIcon} />}
                    >
                      Clear Dates
                    </Button>
                  </Stack>
                </PopoverBody>
              </PopoverContent>
            </Popover>
          </GridItem>
        </Grid>

        {/* Resource Grid - Update z-index */}
        <Box position="relative" zIndex="1" w="100%">
          {isLoadingAllResources || isLoadingUserResources ? (
            <Box textAlign="center" py={10}>
              <Spinner size="xl" color="white" />
              <Text mt={4} color="white" fontSize="lg">
                Loading resources...
              </Text>
            </Box>
          ) : filteredAndSortedResources.length > 0 ? (
            <SimpleGrid
              columns={[1, 2, 3, 4]}
              spacing={6}
              mt={8}
              sx={{
                gridAutoFlow: "row",
                display: "grid",
                gridTemplateColumns: {
                  base: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
              }}
            >
              {filteredAndSortedResources.map((resource) => {
                return (
                  <Box
                    key={resource.id}
                    onClick={() => handleCardClick(resource)}
                    cursor="pointer"
                    borderWidth="1px"
                    borderRadius="lg"
                    overflow="hidden"
                    boxShadow="md"
                    position="relative"
                    bg={resourceColors[resource.id] || "white"} // Use the precomputed color or default to white
                    transition="transform 0.3s, box-shadow 0.3s"
                    _hover={{
                      transform: "translateY(-5px)",
                      boxShadow: "xl",
                    }}
                  >
                    {/* Badge for approval status */}
                    {renderApprovalStatus(resource)}

                    {/* Date badge - top right */}
                    <Text
                      position="absolute"
                      top={2}
                      right={2}
                      bg="blue.500"
                      color="white"
                      px={2}
                      py={1}
                      borderRadius="md"
                      fontSize="sm"
                      fontWeight="bold"
                      zIndex={1}
                    >
                      {formatCardDate(resource.eventDate)}
                    </Text>

                    {/* Image */}
                    <Image
                      src={
                        resource.imageUrl ||
                        "https://via.placeholder.com/300x200"
                      }
                      alt={resource.title}
                      height="200px"
                      width="100%"
                      objectFit="cover"
                    />

                    {/* Card content */}
                    <Box p={4}>
                      <Text
                        fontWeight="semibold"
                        fontSize="xl"
                        mb={2}
                        noOfLines={1}
                        color="gray.800"
                      >
                        {resource.title}
                      </Text>

                      <Flex mb={3} wrap="wrap" gap={2}>
                        <Badge colorScheme="blue" variant="solid">
                          {resource.type}
                        </Badge>
                        <Badge colorScheme="green" variant="solid">
                          {resource.subject}
                        </Badge>
                        <Badge colorScheme="purple" variant="solid">
                          {resource.ageGroup}
                        </Badge>
                      </Flex>

                      <Text noOfLines={3} color="gray.700" mb={3}>
                        {resource.description}
                      </Text>

                      {/* Action buttons */}
                      <Flex mt={4} justify="flex-end" gap={2}>
                        {canEditResource(resource) && (
                          <IconButton
                            icon={<EditIcon />}
                            aria-label="Edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditEvent(resource);
                            }}
                            colorScheme="blue"
                            bg="blue.500"
                            color="white"
                            size="sm"
                            _hover={{
                              bg: "blue.600",
                              transform: "scale(1.1)",
                            }}
                            _active={{
                              bg: "blue.700",
                            }}
                          />
                        )}

                        {canDeleteResource(resource) && (
                          <IconButton
                            icon={<DeleteIcon />}
                            aria-label="Delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteEvent(resource.id);
                            }}
                            colorScheme="red"
                            bg="red.500"
                            color="white"
                            size="sm"
                            _hover={{
                              bg: "red.600",
                              transform: "scale(1.1)",
                            }}
                            _active={{
                              bg: "red.700",
                            }}
                          />
                        )}
                      </Flex>
                    </Box>
                  </Box>
                );
              })}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py={10}>
              <Text fontSize="xl" color="white">
                {searchQuery
                  ? "No resources found matching your search."
                  : filter === "mine"
                  ? "You haven't created any resources yet."
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
        size="xl"
        scrollBehavior="inside"
      >
        <ModalOverlay backdropFilter="blur(2px)" />
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
    </Box>
  );
};

export default HomePage;

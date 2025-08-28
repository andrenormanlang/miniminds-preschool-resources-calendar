import React from "react";
import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  VStack,
  Button,
  Collapse,
  Text,
  useDisclosure,
  Flex,
  useBreakpointValue,
  Divider,
} from "@chakra-ui/react";
import { SearchIcon, ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { FiFilter } from "react-icons/fi";

interface SearchFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedSubject: string;
  onSubjectChange: (value: string) => void;
  selectedAgeGroup: string;
  onAgeGroupChange: (value: string) => void;
  startDate: string;
  onStartDateChange: (value: string) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  onClearFilters: () => void;
  userRole?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedSubject,
  onSubjectChange,
  selectedAgeGroup,
  onAgeGroupChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  onClearFilters,
}) => {
  const { isOpen, onToggle } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const hasActiveFilters =
    selectedType !== "all" ||
    selectedSubject !== "all" ||
    selectedAgeGroup !== "all" ||
    startDate ||
    endDate;

  return (
    <Box
      bg="white"
      borderRadius="lg"
      boxShadow="sm"
      border="1px solid"
      borderColor="gray.200"
      p={{ base: 3, md: 4 }}
      mb={{ base: 4, md: 6 }}
    >
      {/* Search Bar */}
      <InputGroup size={isMobile ? "md" : "lg"} mb={3}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.400" />
        </InputLeftElement>
        <Input
          placeholder="Search resources..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          borderRadius="lg"
          _focus={{
            borderColor: "purple.500",
            boxShadow: "0 0 0 1px #6B46C1",
          }}
        />
      </InputGroup>

      {/* Filter Toggle Button for All Screen Sizes */}
      <Button
        variant="outline"
        leftIcon={<FiFilter />}
        rightIcon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        onClick={onToggle}
        width="100%"
        justifyContent="space-between"
        colorScheme={hasActiveFilters ? "purple" : "gray"}
        size={isMobile ? "sm" : "md"}
        borderRadius="md"
        _hover={{
          bg: hasActiveFilters ? "purple.50" : "gray.50",
          borderColor: hasActiveFilters ? "purple.400" : "gray.400",
        }}
      >
        <Flex align="center" gap={2}>
          <Text fontWeight="medium">
            {isOpen ? "Hide Filters" : "Show Filters"}
          </Text>
          {hasActiveFilters && (
            <Text
              bg="purple.100"
              color="purple.600"
              px={2}
              py={0.5}
              borderRadius="full"
              fontSize="xs"
              fontWeight="bold"
            >
              {[
                selectedType !== "all" ? 1 : 0,
                selectedSubject !== "all" ? 1 : 0,
                selectedAgeGroup !== "all" ? 1 : 0,
                startDate ? 1 : 0,
                endDate ? 1 : 0,
              ].reduce((a, b) => a + b, 0)} Active
            </Text>
          )}
        </Flex>
      </Button>

      {/* Filters Section */}
      <Collapse in={isOpen} animateOpacity>
        <Box pt={3}>
          <Divider mb={4} />

          <VStack spacing={4} align="stretch">
            {/* Date Range Section */}
            <Box>
              <Text 
                fontSize="sm" 
                fontWeight="semibold" 
                mb={3} 
                color="gray.700"
                display="flex"
                alignItems="center"
                gap={2}
              >
                📅 Date Range
              </Text>
              <VStack spacing={3} align="stretch">
                <Input
                  type="date"
                  placeholder="Start Date"
                  value={startDate}
                  onChange={(e) => onStartDateChange(e.target.value)}
                  size={isMobile ? "sm" : "md"}
                  borderRadius="md"
                  _focus={{
                    borderColor: "purple.500",
                    boxShadow: "0 0 0 1px #6B46C1",
                  }}
                />
                <Input
                  type="date"
                  placeholder="End Date"
                  value={endDate}
                  onChange={(e) => onEndDateChange(e.target.value)}
                  size={isMobile ? "sm" : "md"}
                  borderRadius="md"
                  _focus={{
                    borderColor: "purple.500",
                    boxShadow: "0 0 0 1px #6B46C1",
                  }}
                />
              </VStack>
            </Box>

            {/* Categories Section */}
            <Box>
              <Text 
                fontSize="sm" 
                fontWeight="semibold" 
                mb={3} 
                color="gray.700"
                display="flex"
                alignItems="center"
                gap={2}
              >
                🏷️ Categories
              </Text>
              <VStack spacing={3} align="stretch">
                <Select
                  value={selectedType}
                  onChange={(e) => onTypeChange(e.target.value)}
                  size={isMobile ? "sm" : "md"}
                  borderRadius="md"
                  _focus={{
                    borderColor: "purple.500",
                    boxShadow: "0 0 0 1px #6B46C1",
                  }}
                >
                  <option value="all">All Types</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Lesson">Lesson</option>
                  <option value="Activity">Activity</option>
                  <option value="Event">Event</option>
                  <option value="Field Trip">Field Trip</option>
                </Select>

                <Select
                  value={selectedSubject}
                  onChange={(e) => onSubjectChange(e.target.value)}
                  size={isMobile ? "sm" : "md"}
                  borderRadius="md"
                  _focus={{
                    borderColor: "purple.500",
                    boxShadow: "0 0 0 1px #6B46C1",
                  }}
                >
                  <option value="all">All Subjects</option>
                  <option value="Math">Math</option>
                  <option value="Science">Science</option>
                  <option value="Language Arts">Language Arts</option>
                  <option value="Social Studies">Social Studies</option>
                  <option value="Art">Art</option>
                  <option value="Music">Music</option>
                  <option value="Physical Education">Physical Education</option>
                  <option value="Technology">Technology</option>
                </Select>

                <Select
                  value={selectedAgeGroup}
                  onChange={(e) => onAgeGroupChange(e.target.value)}
                  size={isMobile ? "sm" : "md"}
                  borderRadius="md"
                  _focus={{
                    borderColor: "purple.500",
                    boxShadow: "0 0 0 1px #6B46C1",
                  }}
                >
                  <option value="all">All Age Groups</option>
                  <option value="3-4 years">3-4 years</option>
                  <option value="4-5 years">4-5 years</option>
                  <option value="5-6 years">5-6 years</option>
                  <option value="Mixed Age">Mixed Age</option>
                </Select>
              </VStack>
            </Box>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Box pt={2} borderTop="1px solid" borderColor="gray.200">
                <Button
                  variant="outline"
                  colorScheme="red"
                  size={isMobile ? "sm" : "md"}
                  onClick={onClearFilters}
                  width="100%"
                  borderRadius="md"
                  _hover={{
                    bg: "red.50",
                    borderColor: "red.400",
                  }}
                >
                  🗑️ Clear All Filters
                </Button>
              </Box>
            )}
          </VStack>
        </Box>
      </Collapse>
    </Box>
  );
};

export default SearchFilter;

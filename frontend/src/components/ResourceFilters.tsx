import React from "react";
import {
  Grid,
  GridItem,
  InputGroup,
  InputLeftElement,
  Input,
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverArrow,
  PopoverHeader,
  PopoverCloseButton,
  VStack,
  Icon,
  Stack,
  Box,
  Text,
} from "@chakra-ui/react";
import {
  SearchIcon,
  ChevronDownIcon,
  CalendarIcon,
  DeleteIcon,
} from "@chakra-ui/icons";
import { FaBookOpen, FaUsers, FaGraduationCap } from "react-icons/fa";

interface FilterOptions {
  types: string[];
  subjects: string[];
  ageGroups: string[];
}

interface ResourceFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedType: string;
  setSelectedType: (type: string) => void;
  selectedSubject: string;
  setSelectedSubject: (subject: string) => void;
  selectedAgeGroup: string;
  setSelectedAgeGroup: (ageGroup: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  filterOptions: FilterOptions;
  showAllFilters?: boolean;
}

const ResourceFilters: React.FC<ResourceFiltersProps> = ({
  searchQuery,
  setSearchQuery,
  selectedType,
  setSelectedType,
  selectedSubject,
  setSelectedSubject,
  selectedAgeGroup,
  setSelectedAgeGroup,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  filterOptions,
  showAllFilters = true,
}) => {
  return (
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
      {/* Search Bar */}
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

      {showAllFilters && (
        <>
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

          {/* Date Range Filter */}
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
        </>
      )}
    </Grid>
  );
};

export default ResourceFilters;

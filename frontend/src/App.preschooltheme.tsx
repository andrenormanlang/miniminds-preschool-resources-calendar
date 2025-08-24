import React from 'react';
import { ChakraProvider, Box, Heading, Text, Button, Card, CardBody, Tag, Stack, Grid, Container, VStack, HStack, Badge, Avatar, Flex, SimpleGrid, Divider } from '@chakra-ui/react';
import preschoolTheme from './theme/preschoolTheme';
import EducationalIcons from './components/icons/EducationalIcons';
import Logo from './components/Logo';
import './App.css';

const PreschoolThemePreview = () => {
  return (
    <ChakraProvider theme={preschoolTheme}>
      {/* Main container with animated gradient background */}
      <Box minH="100vh" className="bg-rainbow" py={8}>
        <Container maxW="7xl">
          {/* Header Section with enhanced logo showcase */}
          <Box className="bg-bubbles" borderRadius="3xl" p={8} mb={12}>
            <VStack spacing={8} textAlign="center">
              <VStack spacing={6}>
                <HStack spacing={4} justify="center" flexWrap="wrap">
                  <EducationalIcons.Reading variant="playful" animation="bounce" boxSize="8" />
                  <EducationalIcons.Achievement variant="playful" animation="pulse" boxSize="8" />
                  <EducationalIcons.Creativity variant="playful" animation="wiggle" boxSize="8" />
                </HStack>
                
                {/* Showcase different logo variants */}
                <VStack spacing={4}>
                  <Logo 
                    size="xl"
                    variant="gradient"
                    showIcon={true}
                    showTagline={true}
                  />
                  <Text variant="handwritten" fontSize="xl" color="purple.600">
                    Where learning becomes an adventure!
                  </Text>
                </VStack>
              </VStack>
              
              <Text variant="playful" maxW="2xl" fontSize="lg">
                Connecting educators and parents with amazing preschool learning resources
              </Text>
              
              <HStack spacing={4} flexWrap="wrap" justify="center">
                <Button variant="solid" size="lg" className="bounce-on-hover" leftIcon={<EducationalIcons.Learning boxSize="5" />}>
                  Explore Resources
                </Button>
                <Button variant="playful" size="lg" className="bounce-on-hover" leftIcon={<EducationalIcons.Love boxSize="5" />}>
                  Join Community
                </Button>
                <Button variant="success" size="lg" className="bounce-on-hover" leftIcon={<EducationalIcons.Success boxSize="5" />}>
                  Get Started
                </Button>
              </HStack>
            </VStack>
          </Box>

          {/* Logo Showcase Section */}
          <Box className="bg-primary" borderRadius="3xl" p={8} mb={12}>
            <VStack spacing={8}>
              <HStack spacing={4} align="center">
                <EducationalIcons.Achievement variant="filled" boxSize="8" color="white" />
                <Heading variant="educational" textAlign="center" color="white">
                  Enhanced Logo with Modern Sans-Serif Fonts
                </Heading>
                <EducationalIcons.Achievement variant="filled" boxSize="8" color="white" />
              </HStack>
              
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
                {/* Default Logo */}
                <Card variant="resource" p={6} bg="white" boxShadow="2xl" textAlign="center">
                  <VStack spacing={4}>
                    <Text variant="label" color="gray.600">Default Logo</Text>
                    <Logo 
                      size="lg"
                      variant="colorful"
                      showIcon={true}
                      showTagline={false}
                      to=""
                    />
                    <Text fontSize="sm" color="gray.500">Space Grotesk font family</Text>
                  </VStack>
                </Card>

                {/* Gradient Logo */}
                <Card variant="resource" p={6} bg="white" boxShadow="2xl" textAlign="center">
                  <VStack spacing={4}>
                    <Text variant="label" color="gray.600">Gradient Logo</Text>
                    <Logo 
                      size="lg"
                      variant="gradient"
                      showIcon={true}
                      showTagline={false}
                      to=""
                    />
                    <Text fontSize="sm" color="gray.500">Modern gradient effect</Text>
                  </VStack>
                </Card>

                {/* Stacked Logo */}
                <Card variant="resource" p={6} bg="white" boxShadow="2xl" textAlign="center">
                  <VStack spacing={4}>
                    <Text variant="label" color="gray.600">Stacked Logo</Text>
                    <Logo 
                      size="md"
                      variant="stacked"
                      showIcon={true}
                      showTagline={true}
                      to=""
                    />
                    <Text fontSize="sm" color="gray.500">Vertical layout with tagline</Text>
                  </VStack>
                </Card>

                {/* Minimal Logo */}
                <Card variant="resource" p={6} bg="white" boxShadow="2xl" textAlign="center">
                  <VStack spacing={4}>
                    <Text variant="label" color="gray.600">Minimal Logo</Text>
                    <Logo 
                      size="lg"
                      variant="minimal"
                      showIcon={false}
                      showTagline={false}
                      color="gray.800"
                      to=""
                    />
                    <Text fontSize="sm" color="gray.500">Clean, text-only version</Text>
                  </VStack>
                </Card>

                {/* Small Logo */}
                <Card variant="resource" p={6} bg="white" boxShadow="2xl" textAlign="center">
                  <VStack spacing={4}>
                    <Text variant="label" color="gray.600">Small Logo</Text>
                    <Logo 
                      size="sm"
                      variant="default"
                      showIcon={true}
                      showTagline={false}
                      color="primary.600"
                      to=""
                    />
                    <Text fontSize="sm" color="gray.500">Compact size for headers</Text>
                  </VStack>
                </Card>

                {/* Large Logo */}
                <Card variant="resource" p={6} bg="white" boxShadow="2xl" textAlign="center">
                  <VStack spacing={4}>
                    <Text variant="label" color="gray.600">Large Logo</Text>
                    <Logo 
                      size="xl"
                      variant="colorful"
                      showIcon={true}
                      showTagline={true}
                      to=""
                    />
                    <Text fontSize="sm" color="gray.500">Hero size with tagline</Text>
                  </VStack>
                </Card>
              </SimpleGrid>

              <Divider borderColor="whiteAlpha.300" />

              <VStack spacing={4}>
                <Heading size="md" color="white" textAlign="center">
                  Font Family Options
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
                  <Card p={6} bg="whiteAlpha.90" backdropFilter="blur(10px)">
                    <VStack spacing={3} align="start">
                      <Text variant="label" color="gray.700">Primary Logo Font</Text>
                      <Text className="font-logo" fontSize="2xl" color="primary.600">
                        Space Grotesk
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Modern, geometric sans-serif with excellent readability
                      </Text>
                    </VStack>
                  </Card>
                  
                  <Card p={6} bg="whiteAlpha.90" backdropFilter="blur(10px)">
                    <VStack spacing={3} align="start">
                      <Text variant="label" color="gray.700">Alternative Fonts</Text>
                      <VStack spacing={2} align="start">
                        <Text className="font-brand" fontSize="lg" color="secondary.600">
                          Outfit - Clean & friendly
                        </Text>
                        <Text className="font-modern" fontSize="lg" color="success.600">
                          Inter - Professional & readable
                        </Text>
                        <Text fontFamily="Plus Jakarta Sans" fontSize="lg" color="purple.600">
                          Plus Jakarta Sans - Modern & versatile
                        </Text>
                      </VStack>
                    </VStack>
                  </Card>
                </SimpleGrid>
              </VStack>
            </VStack>
          </Box>

          {/* Background Showcase Section */}
          <VStack spacing={8} mb={12}>
            <Box className="bg-clouds" borderRadius="3xl" p={8} w="full">
              <Heading size="lg" color="primary.600" textAlign="center" mb={6}>
                🎨 Beautiful Background Variations
              </Heading>
              <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6}>
                <Box className="bg-primary" p={6} borderRadius="2xl" textAlign="center" border="2px solid" borderColor="primary.200">
                  <Text fontWeight="bold" color="primary.700">Primary Ocean</Text>
                  <Text fontSize="sm" color="gray.600">Trustworthy & Calming</Text>
                </Box>
                <Box className="bg-warm" p={6} borderRadius="2xl" textAlign="center" border="2px solid" borderColor="secondary.200">
                  <Text fontWeight="bold" color="secondary.700">Warm Embrace</Text>
                  <Text fontSize="sm" color="gray.600">Cozy & Inviting</Text>
                </Box>
                <Box className="bg-nature" p={6} borderRadius="2xl" textAlign="center" border="2px solid" borderColor="success.200">
                  <Text fontWeight="bold" color="success.700">Nature Fresh</Text>
                  <Text fontSize="sm" color="gray.600">Growth & Learning</Text>
                </Box>
                <Box className="bg-creative" p={6} borderRadius="2xl" textAlign="center" border="2px solid" borderColor="purple.200">
                  <Text fontWeight="bold" color="purple.700">Creative Dreams</Text>
                  <Text fontSize="sm" color="gray.600">Imagination & Art</Text>
                </Box>
                <Box className="bg-sunny" p={6} borderRadius="2xl" textAlign="center" border="2px solid" borderColor="warning.200">
                  <Text fontWeight="bold" color="warning.700">Sunny Joy</Text>
                  <Text fontSize="sm" color="gray.600">Happiness & Energy</Text>
                </Box>
                <Box className="bg-ocean" p={6} borderRadius="2xl" textAlign="center" border="2px solid" borderColor="blue.200">
                  <Text fontWeight="bold" color="blue.700">Ocean Breeze</Text>
                  <Text fontSize="sm" color="gray.600">Fresh & Clean</Text>
                </Box>
              </Grid>
            </Box>
          </VStack>

          {/* Enhanced Color Palette Display */}
          <Box className="bg-warm" borderRadius="3xl" p={8} mb={12}>
            <VStack spacing={6}>
              <Heading size="lg" color="secondary.600" textAlign="center">
                🎨 Our Friendly Color Palette
              </Heading>
              <Grid templateColumns="repeat(auto-fit, minmax(200px, 1fr))" gap={6} w="full">
                <Card variant="playful" className="bounce-on-hover" bg="white" boxShadow="xl">
                  <CardBody textAlign="center">
                    <Box w="full" h="20" bg="primary.500" borderRadius="xl" mb={4} boxShadow="lg" />
                    <Text fontWeight="bold" color="primary.600">Primary Blue</Text>
                    <Text fontSize="sm" color="gray.600">Trustworthy & Friendly</Text>
                  </CardBody>
                </Card>
                
                <Card variant="playful" className="bounce-on-hover" bg="white" boxShadow="xl">
                  <CardBody textAlign="center">
                    <Box w="full" h="20" bg="secondary.500" borderRadius="xl" mb={4} boxShadow="lg" />
                    <Text fontWeight="bold" color="secondary.600">Warm Coral</Text>
                    <Text fontSize="sm" color="gray.600">Inviting & Energetic</Text>
                  </CardBody>
                </Card>
                
                <Card variant="playful" className="bounce-on-hover" bg="white" boxShadow="xl">
                  <CardBody textAlign="center">
                    <Box w="full" h="20" bg="success.500" borderRadius="xl" mb={4} boxShadow="lg" />
                    <Text fontWeight="bold" color="success.600">Nature Green</Text>
                    <Text fontSize="sm" color="gray.600">Growth & Learning</Text>
                  </CardBody>
                </Card>
                
                <Card variant="playful" className="bounce-on-hover" bg="white" boxShadow="xl">
                  <CardBody textAlign="center">
                    <Box w="full" h="20" bg="warning.500" borderRadius="xl" mb={4} boxShadow="lg" />
                    <Text fontWeight="bold" color="warning.700">Sunny Yellow</Text>
                    <Text fontSize="sm" color="gray.600">Joy & Creativity</Text>
                  </CardBody>
                </Card>
                
                <Card variant="playful" className="bounce-on-hover" bg="white" boxShadow="xl">
                  <CardBody textAlign="center">
                    <Box w="full" h="20" bg="purple.500" borderRadius="xl" mb={4} boxShadow="lg" />
                    <Text fontWeight="bold" color="purple.600">Creative Purple</Text>
                    <Text fontSize="sm" color="gray.600">Imagination & Art</Text>
                  </CardBody>
                </Card>
                
                <Card variant="playful" className="bounce-on-hover" bg="white" boxShadow="xl">
                  <CardBody textAlign="center">
                    <Box w="full" h="20" bg="error.500" borderRadius="xl" mb={4} boxShadow="lg" />
                    <Text fontWeight="bold" color="error.600">Gentle Red</Text>
                    <Text fontSize="sm" color="gray.600">Attention & Care</Text>
                  </CardBody>
                </Card>
              </Grid>
            </VStack>
          </Box>

          {/* Sample Resource Cards with enhanced backgrounds */}
          <Box className="bg-nature" borderRadius="3xl" p={8} mb={12}>
            <VStack spacing={6}>
              <Heading size="lg" color="purple.600" textAlign="center">
                📚 Sample Learning Resources
              </Heading>
              <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={8} w="full">
                {/* Card 1 */}
                <Box className="resource-card color-0" borderRadius="3xl" overflow="hidden" position="relative">
                  <Box className="overlay" />
                  <Box className="content" p={6}>
                    <Badge className="date-badge">Age 3-5</Badge>
                    <Heading size="md" mb={3} color="white">
                      🎨 Creative Art Activities
                    </Heading>
                    <Text mb={4} color="white" opacity={0.9}>
                      Fun and engaging art projects that develop fine motor skills and creativity
                    </Text>
                    <HStack spacing={2} flexWrap="wrap">
                      <Tag variant="playful" size="sm">Art</Tag>
                      <Tag variant="age" size="sm">Preschool</Tag>
                      <Tag variant="subject" size="sm">Creative</Tag>
                    </HStack>
                  </Box>
                </Box>

                {/* Card 2 */}
                <Box className="resource-card color-1" borderRadius="3xl" overflow="hidden" position="relative">
                  <Box className="overlay" />
                  <Box className="content" p={6}>
                    <Badge className="date-badge">Age 4-6</Badge>
                    <Heading size="md" mb={3} color="white">
                      📚 Reading Adventures
                    </Heading>
                    <Text mb={4} color="white" opacity={0.9}>
                      Interactive stories and phonics games to build early reading skills
                    </Text>
                    <HStack spacing={2} flexWrap="wrap">
                      <Tag variant="playful" size="sm">Reading</Tag>
                      <Tag variant="age" size="sm">Pre-K</Tag>
                      <Tag variant="subject" size="sm">Literacy</Tag>
                    </HStack>
                  </Box>
                </Box>

                {/* Card 3 */}
                <Box className="resource-card color-2" borderRadius="3xl" overflow="hidden" position="relative">
                  <Box className="overlay" />
                  <Box className="content" p={6}>
                    <Badge className="date-badge">Age 3-4</Badge>
                    <Heading size="md" mb={3} color="white">
                      🔢 Number Fun
                    </Heading>
                    <Text mb={4} color="white" opacity={0.9}>
                      Playful math activities introducing counting and basic number concepts
                    </Text>
                    <HStack spacing={2} flexWrap="wrap">
                      <Tag variant="playful" size="sm">Math</Tag>
                      <Tag variant="age" size="sm">Toddler</Tag>
                      <Tag variant="subject" size="sm">Numbers</Tag>
                    </HStack>
                  </Box>
                </Box>
              </Grid>
            </VStack>
          </Box>

          {/* Enhanced Typography Showcase */}
          <Box className="bg-creative" borderRadius="3xl" p={8} mb={12}>
            <VStack spacing={8}>
              <HStack spacing={4} align="center">
                <EducationalIcons.Writing variant="outlined" boxSize="8" color="purple.600" />
                <Heading variant="educational" textAlign="center">
                  Enhanced Typography & Fonts
                </Heading>
                <EducationalIcons.Editing variant="outlined" boxSize="8" color="purple.600" />
              </HStack>
              
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} w="full">
                {/* Typography Variants */}
                <Card variant="resource" p={8} bg="white" boxShadow="2xl">
                  <VStack spacing={6} align="start">
                    <Heading size="md" color="primary.600" mb={4}>Typography Variants</Heading>
                    
                    <Box>
                      <Text variant="label" mb={2}>Hero Text</Text>
                      <Heading variant="hero" size="xl">Amazing Learning Journey</Heading>
                    </Box>
                    
                    <Box>
                      <Text variant="label" mb={2}>Playful Text</Text>
                      <Heading variant="playful" size="lg">Fun Learning Activities</Heading>
                    </Box>
                    
                    <Box>
                      <Text variant="label" mb={2}>Handwritten Style</Text>
                      <Heading variant="handwritten" size="lg">Creative Expression</Heading>
                    </Box>
                    
                    <Box>
                      <Text variant="label" mb={2}>Educational Style</Text>
                      <Heading variant="educational" size="md">Learning Objectives</Heading>
                    </Box>
                    
                    <Box>
                      <Text variant="label" mb={2}>Body Text Variants</Text>
                      <Text variant="description" mb={2}>
                        This is our standard description text using Poppins and Nunito fonts.
                      </Text>
                      <Text variant="playful" mb={2}>
                        This is playful text using Baloo 2 font family.
                      </Text>
                      <Text variant="quote">
                        Learning is a treasure that will follow its owner everywhere.
                      </Text>
                    </Box>
                  </VStack>
                </Card>

                {/* Font Families */}
                <Card variant="resource" p={8} bg="white" boxShadow="2xl">
                  <VStack spacing={6} align="start">
                    <Heading size="md" color="secondary.600" mb={4}>Font Families</Heading>
                    
                    <Box>
                      <Text variant="label" mb={2}>Fredoka (Headings)</Text>
                      <Text className="font-playful" fontSize="xl" color="primary.600">
                        Friendly and approachable for main headings
                      </Text>
                    </Box>
                    
                    <Box>
                      <Text variant="label" mb={2}>Poppins (Body)</Text>
                      <Text className="font-body" fontSize="md" color="gray.700">
                        Clean and readable for body text and descriptions
                      </Text>
                    </Box>
                    
                    <Box>
                      <Text variant="label" mb={2}>Baloo 2 (Playful)</Text>
                      <Text className="font-playful" fontSize="lg" color="secondary.600">
                        Fun and engaging for interactive elements
                      </Text>
                    </Box>
                    
                    <Box>
                      <Text variant="label" mb={2}>Caveat (Handwritten)</Text>
                      <Text className="font-handwritten" fontSize="xl" color="purple.600">
                        Personal and creative for special messages
                      </Text>
                    </Box>
                    
                    <Box>
                      <Text variant="label" mb={2}>Quicksand (Rounded)</Text>
                      <Text className="font-rounded" fontSize="md" color="success.600">
                        Modern and friendly for labels and UI elements
                      </Text>
                    </Box>
                  </VStack>
                </Card>
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Enhanced Icons & Interactive Elements */}
          <Box className="bg-sunny" borderRadius="3xl" p={8} mb={12}>
            <VStack spacing={8}>
              <HStack spacing={4} align="center">
                <EducationalIcons.Achievement variant="filled" boxSize="8" />
                <Heading variant="educational" textAlign="center">
                  Educational Icons & Interactive Elements
                </Heading>
                <EducationalIcons.Success variant="filled" boxSize="8" />
              </HStack>
              
              <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} w="full">
                {/* Icon Showcase */}
                <Card variant="playful" p={8} bg="white" boxShadow="2xl">
                  <VStack spacing={6}>
                    <Heading size="md" color="primary.600" mb={4}>Educational Icons</Heading>
                    
                    <SimpleGrid columns={4} spacing={6}>
                      <VStack spacing={2}>
                        <EducationalIcons.Reading variant="playful" animation="bounce" boxSize="10" />
                        <Text variant="caption" textAlign="center">Reading</Text>
                      </VStack>
                      <VStack spacing={2}>
                        <EducationalIcons.Writing variant="outlined" animation="wiggle" boxSize="10" />
                        <Text variant="caption" textAlign="center">Writing</Text>
                      </VStack>
                      <VStack spacing={2}>
                        <EducationalIcons.ProblemSolving variant="filled" animation="pulse" boxSize="10" />
                        <Text variant="caption" textAlign="center">Problem Solving</Text>
                      </VStack>
                      <VStack spacing={2}>
                        <EducationalIcons.Creativity variant="rounded" boxSize="10" />
                        <Text variant="caption" textAlign="center">Creativity</Text>
                      </VStack>
                      <VStack spacing={2}>
                        <EducationalIcons.Education variant="playful" boxSize="10" />
                        <Text variant="caption" textAlign="center">Education</Text>
                      </VStack>
                      <VStack spacing={2}>
                        <EducationalIcons.Building variant="outlined" boxSize="10" />
                        <Text variant="caption" textAlign="center">Building</Text>
                      </VStack>
                      <VStack spacing={2}>
                        <EducationalIcons.Love variant="filled" color="error.500" boxSize="10" />
                        <Text variant="caption" textAlign="center">Love</Text>
                      </VStack>
                      <VStack spacing={2}>
                        <EducationalIcons.Teaching variant="rounded" color="success.500" boxSize="10" />
                        <Text variant="caption" textAlign="center">Teaching</Text>
                      </VStack>
                    </SimpleGrid>
                    
                    <Divider />
                    
                    <Box>
                      <Text variant="label" mb={3}>Icon Variants</Text>
                      <HStack spacing={4} justify="center">
                        <EducationalIcons.Achievement variant="default" boxSize="8" />
                        <EducationalIcons.Achievement variant="playful" boxSize="8" />
                        <EducationalIcons.Achievement variant="outlined" boxSize="8" />
                        <EducationalIcons.Achievement variant="filled" boxSize="8" />
                        <EducationalIcons.Achievement variant="rounded" boxSize="8" />
                      </HStack>
                    </Box>
                  </VStack>
                </Card>

                {/* Interactive Elements */}
                <Card variant="playful" p={8} bg="white" boxShadow="2xl">
                  <VStack spacing={6}>
                    <Heading size="md" color="secondary.600" mb={4}>Interactive Elements</Heading>
                    
                    <Box>
                      <Text variant="label" mb={3}>Enhanced Buttons</Text>
                      <VStack spacing={3}>
                        <Button variant="solid" className="bounce-on-hover" leftIcon={<EducationalIcons.Learning boxSize="5" />}>
                          Explore Learning
                        </Button>
                        <Button variant="playful" className="wiggle-on-hover" leftIcon={<EducationalIcons.Creativity boxSize="5" />}>
                          Get Creative
                        </Button>
                        <Button variant="success" className="pulse-on-hover" leftIcon={<EducationalIcons.Achievement boxSize="5" />}>
                          Achieve Goals
                        </Button>
                      </VStack>
                    </Box>
                    
                    <Divider />
                    
                    <Box>
                      <Text variant="label" mb={3}>Enhanced Tags & Badges</Text>
                      <VStack spacing={3}>
                        <HStack spacing={2} flexWrap="wrap">
                          <Tag variant="playful">
                            <EducationalIcons.Reading boxSize="4" mr={1} />
                            Reading
                          </Tag>
                          <Tag variant="age">
                            <EducationalIcons.Education boxSize="4" mr={1} />
                            Age 3-5
                          </Tag>
                          <Tag variant="subject">
                            <EducationalIcons.ProblemSolving boxSize="4" mr={1} />
                            Math
                          </Tag>
                        </HStack>
                        <HStack spacing={2} flexWrap="wrap">
                          <Badge colorScheme="blue" display="flex" alignItems="center" gap={1}>
                            <EducationalIcons.Achievement boxSize="3" />
                            New Resource
                          </Badge>
                          <Badge colorScheme="green" display="flex" alignItems="center" gap={1}>
                            <EducationalIcons.Success boxSize="3" />
                            Approved
                          </Badge>
                        </HStack>
                      </VStack>
                    </Box>
                    
                    <Divider />
                    
                    <Box>
                      <Text variant="label" mb={3}>Community Avatars</Text>
                      <Flex gap={4} align="center" flexWrap="wrap" justify="center">
                        <VStack spacing={2}>
                          <Avatar size="lg" name="Teacher Sarah" bg="primary.500" />
                          <Text variant="caption">Teacher Sarah</Text>
                        </VStack>
                        <VStack spacing={2}>
                          <Avatar size="lg" name="Parent Mike" bg="secondary.500" />
                          <Text variant="caption">Parent Mike</Text>
                        </VStack>
                        <VStack spacing={2}>
                          <Avatar size="lg" name="Admin Lisa" bg="success.500" />
                          <Text variant="caption">Admin Lisa</Text>
                        </VStack>
                      </Flex>
                    </Box>
                  </VStack>
                </Card>
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Loading Animation Preview with ocean background */}
          <Box className="bg-ocean" borderRadius="3xl" p={8} mb={12}>
            <VStack spacing={6}>
              <Heading size="lg" color="warning.600" textAlign="center">
                ⏳ Friendly Loading Animation
              </Heading>
              <Card variant="resource" p={8} textAlign="center" bg="white" boxShadow="2xl">
                <VStack spacing={4}>
                  <Box className="loading" />
                  <Text color="gray.600">
                    Our rainbow loading spinner brings joy even during wait times!
                  </Text>
                </VStack>
              </Card>
            </VStack>
          </Box>

          {/* Enhanced Footer */}
          <Box className="bg-bubbles" borderRadius="3xl" p={8} textAlign="center">
            <VStack spacing={6}>
              <HStack spacing={4} justify="center" flexWrap="wrap">
                <EducationalIcons.Love variant="filled" color="error.500" boxSize="6" animation="pulse" />
                <EducationalIcons.Creativity variant="playful" boxSize="6" animation="wiggle" />
                <EducationalIcons.Achievement variant="rounded" color="warning.500" boxSize="6" animation="bounce" />
              </HStack>
              <Text variant="handwritten" fontSize="2xl" color="purple.600">
                Designed with love for little learners and their grown-ups
              </Text>
              <Text variant="playful" color="primary.600" fontSize="lg">
                Enhanced typography and beautiful icons that inspire creativity and learning
              </Text>
              <HStack spacing={6} justify="center" flexWrap="wrap">
                <VStack spacing={1}>
                  <EducationalIcons.Reading variant="outlined" boxSize="5" />
                  <Text variant="caption">Reading</Text>
                </VStack>
                <VStack spacing={1}>
                  <EducationalIcons.Writing variant="outlined" boxSize="5" />
                  <Text variant="caption">Writing</Text>
                </VStack>
                <VStack spacing={1}>
                  <EducationalIcons.ProblemSolving variant="outlined" boxSize="5" />
                  <Text variant="caption">Problem Solving</Text>
                </VStack>
                <VStack spacing={1}>
                  <EducationalIcons.Creativity variant="outlined" boxSize="5" />
                  <Text variant="caption">Creativity</Text>
                </VStack>
              </HStack>
            </VStack>
          </Box>
        </Container>
      </Box>
    </ChakraProvider>
  );
};

export default PreschoolThemePreview;
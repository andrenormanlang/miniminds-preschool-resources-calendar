// src/pages/UnauthorizedPage.tsx
import { useNavigate } from 'react-router-dom';
import { Box, Heading, Text, Button, Flex, Icon, IconProps } from '@chakra-ui/react';
import { useUser } from '@clerk/clerk-react';

// Create a simple lock icon using JSX with proper typing
const LockIcon = (props: IconProps) => (
  <Icon viewBox="0 0 24 24" {...props}>
    <path
      fill="currentColor"
      d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"
    />
  </Icon>
);

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();
  
  return (
    <Box
      minH="calc(100vh - 70px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      p={4}
    >
      <Flex
        direction="column"
        alignItems="center"
        textAlign="center"
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="xl"
        maxW="600px"
        w="full"
      >
        <Icon as={LockIcon} w={16} h={16} color="red.500" mb={6} />
        
        <Heading 
          fontFamily="Montserrat Alternates" 
          size="xl" 
          mb={4}
          bgGradient="linear(to-r, red.400, purple.500)"
          bgClip="text"
        >
          Access Denied
        </Heading>
        
        <Text fontSize="lg" mb={2}>
          Sorry, you don't have permission to access this page.
        </Text>
        
        {isSignedIn ? (
          <Box mt={4}>
            <Text mb={4}>
              Your current role ({user.publicMetadata.role || 'user'}) doesn't have the required permissions.
              Please contact an administrator if you need access.
            </Text>
          </Box>
        ) : (
          <Text mb={4}>
            You need to sign in with an account that has the appropriate permissions.
          </Text>
        )}
        
        <Flex mt={6} gap={4} direction={["column", "row"]}>
          <Button
            colorScheme="blue"
            onClick={() => navigate('/')}
            w={["full", "auto"]}
          >
            Return to Home
          </Button>
          
          {!isSignedIn && (
            <Button
              variant="outline"
              colorScheme="blue"
              onClick={() => {
                // The SignIn component will be rendered by Clerk when clicking the SignInButton
                // This is just a redirect to home where the sign-in button is accessible
                navigate('/');
              }}
              w={["full", "auto"]}
            >
              Sign In
            </Button>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default UnauthorizedPage;
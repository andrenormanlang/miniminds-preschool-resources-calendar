import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/clerk-react";
import { Box, Button, Flex, Heading, Spacer } from "@chakra-ui/react";

const Header = () => {
  const { isSignedIn, user } = useUser();
  
  return (
    <Flex as="header" width="100%" p={4} alignItems="center" bg="white" boxShadow="sm">
      <Heading size="md" color="blue.600">MiniMinds</Heading>
      <Spacer />
      
      {!isSignedIn ? (
        <Box>
          <SignInButton mode="modal">
            <Button colorScheme="blue" mr={2}>Logga in</Button>
          </SignInButton>
          <SignUpButton mode="modal">
            <Button variant="outline" colorScheme="blue">Registrera</Button>
          </SignUpButton>
        </Box>
      ) : (
        <Flex alignItems="center">
          <Box mr={4} fontSize="sm">Hej, {user.firstName || user.username}!</Box>
          <UserButton afterSignOutUrl="/" />
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
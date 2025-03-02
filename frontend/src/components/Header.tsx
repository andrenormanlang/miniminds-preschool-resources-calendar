import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import { 
  Box, 
  Button, 
  Flex, 
  Heading, 
  Tag, 
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Icon,
  Text,
  MenuDivider,
  HStack
} from "@chakra-ui/react";
import { 
  FiChevronDown, 
  FiHome, 
  FiSettings, 
  FiMoreVertical 
} from "react-icons/fi";
import { 
  GiBookshelf, 
  GiBrain,
  GiCaptainHatProfile,
  GiCrown,
  GiStarFormation  
} from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link as RouterLink } from 'react-router-dom';
import { useAuthFetch } from '../utils/authUtils';

const Header = () => {
  const { isSignedIn, user } = useUser();
  const { authFetch } = useAuthFetch();
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Update user role whenever user or signin status changes
  useEffect(() => {
    const getUserRole = async () => {
      if (isSignedIn) {
        try {
          const userData = await authFetch('http://localhost:4000/api/users/current');
          setUserRole(userData.role);
          
          // Console log for debugging
          console.log('=========== USER INFO ===========');
          console.log('User authenticated:', isSignedIn);
          console.log('User ID:', user?.id);
          console.log('User role:', userData.role);
          console.log('User email:', user?.primaryEmailAddress?.emailAddress);
          console.log('User is approved:', userData.isApproved);
          console.log('================================');
          
        } catch (error) {
          console.error('Failed to get user role:', error);
        }
      } else {
        setUserRole(null);
        console.log('No user is currently signed in');
      }
    };

    getUserRole();
  }, [isSignedIn, authFetch, user]);
  
  // Helper function to check if user can add resources
  const canAddResource = () => {
    return userRole === 'admin' || userRole === 'superAdmin';
  };
  
  // Navigate to home and trigger add resource
  const handleAddResource = () => {
    navigate('/?addResource=true');
  };
  
  // Helper function to format role display
  const formatRoleDisplay = (role: string) => {
    if (role.toLowerCase() === 'superadmin') {
      return 'Super Admin';
    } else if (role.toLowerCase() === 'admin') {
      return 'Admin';
    }
    return role;
  };
  
  // Helper function to get role icon
  const getRoleIcon = (role: string) => {
    if (role.toLowerCase() === 'superadmin') {
      return GiCrown;
    } else if (role.toLowerCase() === 'admin') {
      return GiStarFormation;
    }
    return null;
  };
  
  return (
    <Box bg="white" px={4} boxShadow="md" position="sticky" top={0} zIndex={10}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Logo - colorful and kid-friendly */}
        <Box>
          <RouterLink to="/">
            <HStack spacing={2}>
              <Icon as={GiBrain} boxSize={8} color="purple.500" />
              <Heading 
                size="lg" 
                fontFamily="Montserrat Alternates" 
                fontWeight="800"
                bgGradient="linear(to-r, red.500, orange.500, yellow.500, green.500, blue.500, purple.500)"
                bgClip="text"
              >
                MiniMinds
              </Heading>
            </HStack>
          </RouterLink>
        </Box>

        {/* User Authentication */}
        <Flex alignItems="center" gap={2}>
          {isSignedIn ? (
            <Flex alignItems="center" gap={2}>
              {/* Role Tag with Icon */}
              {userRole && (
                <Tag
                  bgColor={
                    userRole.toLowerCase() === 'superadmin' ? 'red.600' : 
                    userRole.toLowerCase() === 'admin' ? 'blue.600' : 'green.600'
                  }
                  color="white"
                  fontWeight="medium"
                  size="md"
                  p={2}
                >
                  <HStack spacing={1}>
                    {getRoleIcon(userRole) && (
                      <Icon 
                        as={getRoleIcon(userRole)} 
                        boxSize={4} 
                        color="yellow.300" 
                      />
                    )}
                    <Text>{formatRoleDisplay(userRole)}</Text>
                  </HStack>
                </Tag>
              )}
              
              {/* Navigation Menu */}
              <Menu>
                <MenuButton
                  as={Button}
                  size="sm"
                  aria-label="Navigation"
                  variant="ghost"
                  minW="auto"
                  p={1}
                >
                  <FiMoreVertical />
                </MenuButton>
                <MenuList zIndex={100}>
                  <MenuItem 
                    as={RouterLink} 
                    to="/"
                    icon={<Icon as={FiHome} boxSize={4} />}
                  >
                    Home
                  </MenuItem>
                  
                  {/* Only show Admin Dashboard for superAdmin */}
                  {userRole === 'superAdmin' && (
                    <MenuItem 
                      as={RouterLink} 
                      to="/admin"
                      icon={<Icon as={GiCaptainHatProfile} boxSize={5} color="purple.500" />}
                    >
                      Admin Dashboard
                    </MenuItem>
                  )}
                  
                  {/* Add Resource option for admins and superAdmins */}
                  {canAddResource() && (
                    <>
                      <MenuDivider />
                      <MenuItem 
                        onClick={handleAddResource}
                        icon={<Icon as={GiBookshelf} boxSize={5} color="teal.500" />}
                      >
                        Add Resource
                      </MenuItem>
                    </>
                  )}
                </MenuList>
              </Menu>
              
              {/* Clerk User Button with its own dropdown */}
              <UserButton afterSignOutUrl="/" />
            </Flex>
          ) : (
            <SignInButton mode="modal">
              <Button 
                bgColor="blue.600" 
                color="white"
                size={{ base: 'sm', md: 'md' }}
                _hover={{ bgColor: "blue.700" }}
                leftIcon={<Icon as={FiChevronDown} />}
              >
                Sign In
              </Button>
            </SignInButton>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
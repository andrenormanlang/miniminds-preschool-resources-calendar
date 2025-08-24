import { SignInButton, UserButton, useUser } from "@clerk/clerk-react";
import {
  Box,
  Button,
  Flex,
  Tag,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  MenuDivider,
  HStack,
  MenuGroup,
  Text, // Added Text component for displaying date/time
} from "@chakra-ui/react";
import { FiChevronDown, FiMoreVertical } from "react-icons/fi";
import {
  GiBookshelf,
  GiCrown,
  GiStarFormation,
  GiGraduateCap,
} from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthFetch } from "../utils/authUtils";
import { MdDashboard } from "react-icons/md";
import Logo from "./Logo";

const Header = () => {
  const { isSignedIn, user } = useUser();
  const { authFetch } = useAuthFetch();
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formattedDate = currentDateTime.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Update user role whenever user or signin status changes
  useEffect(() => {
    const getUserRole = async () => {
      if (isSignedIn) {
        try {
          const userData = await authFetch(
            "http://localhost:4000/api/users/current"
          );
          setUserRole(userData.role);
        } catch (error) {
          console.error("Failed to get user role:", error);
        }
      } else {
        setUserRole(null);
      }
    };

    getUserRole();
  }, [isSignedIn, authFetch, user]);

  // Helper function to check if user can add resources
  const canAddResource = () => {
    return userRole === "admin" || userRole === "superAdmin";
  };

  // Navigate to home and trigger add resource
  const handleAddResource = () => {
    navigate("/?addResource=true");
  };

  // Helper function to format role display
  // const formatRoleDisplay = (role: string) => {
  //   if (role.toLowerCase() === "superadmin") {
  //     return "Super Admin";
  //   } else if (role.toLowerCase() === "admin") {
  //     return "Admin";
  //   }
  //   return role;
  // };

  // Helper function to get role icon
  const getRoleIcon = (role: string): React.ElementType => {
    if (role.toLowerCase() === "superadmin") {
      return GiCrown;
    } else if (role.toLowerCase() === "admin") {
      return GiStarFormation;
    } else if (role.toLowerCase() === "user") {
      return GiGraduateCap;
    }
    return GiGraduateCap;
  };

  return (
    <Box
      bg="#6B46C1"
      px={4}
      boxShadow="0 4px 6px rgba(0,0,0,0.1)"
      position="sticky"
      top={0}
      zIndex={1100}
      isolation="isolate"
    >
      <Flex
        h={16}
        alignItems="center"
        justifyContent="space-between"
        position="relative"
        flexWrap="wrap"
        pt={{ base: 12, md: 0 }}
        pb={{ base: 2, md: 0 }}
      >
        <Flex alignItems="center" justifyContent={{ base: "center", md: "flex-start" }} flexWrap="wrap">
          {/* Enhanced Logo with modern sans-serif font */}
          <Logo 
            size="md"
            variant="default"
            showIcon={true}
            showTagline={false}
            color="white"
            iconColor="yellow.300"
            to="/"
          />
          {/* Date and Time Display */}
          <Box
            ml={{ base: 0, md: 4 }}
            mt={{ base: 2, md: 0 }}
            textAlign={{ base: "center", md: "left" }}
          >
            {/* <Text
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="bold"
              color="white"
              textShadow="1px 1px 2px rgba(0,0,0,0.3)"
              whiteSpace="nowrap"
            >
              {formattedDate}
            </Text>
            <Text
              fontSize={{ base: "xs", md: "sm" }}
              color="whiteAlpha.800"
              textShadow="1px 1px 2px rgba(0,0,0,0.3)"
              whiteSpace="nowrap"
            >
              {formattedTime}
            </Text> */}
          </Box>
        </Flex>
        <Flex alignItems="center" gap={3}>
          {isSignedIn ? (
            <Flex alignItems="center" gap={3}>
              {/* Role Tag with Icon */}
              {userRole && (
                <Tag
                  bgColor={
                    userRole.toLowerCase() === "superadmin"
                      ? "red.500"
                      : userRole.toLowerCase() === "admin"
                      ? "blue.500"
                      : "green.500"
                  }
                  color="white"
                  fontWeight="medium"
                  size="md"
                  p={2}
                  boxShadow="0 2px 4px rgba(0,0,0,0.2)"
                >
                  <HStack spacing={1}>
                    {getRoleIcon(userRole) && (
                      <Icon
                        as={getRoleIcon(userRole)}
                        boxSize={4}
                        color="yellow.300"
                      />
                    )}
                    {/* <Text>{formatRoleDisplay(userRole)}</Text> */}
                  </HStack>
                </Tag>
              )}

              {/* Navigation Menu - Only show for admin and superAdmin */}
              {userRole && userRole !== "user" && (
                <Menu>
                  <MenuButton
                    as={Button}
                    size="sm"
                    aria-label="Navigation"
                    variant="solid"
                    bg="white"
                    color="purple.700"
                    _hover={{ bg: "gray.100" }}
                    _active={{ bg: "gray.200" }}
                    minW="auto"
                    p={1.5}
                    borderRadius="full"
                    boxShadow="0 2px 4px rgba(0,0,0,0.2)"
                    isDisabled={false}
                  >
                    <FiMoreVertical />
                  </MenuButton>
                  <MenuList
                    zIndex={1000}
                    bg="white"
                    shadow="xl"
                    border="none"
                    borderRadius="md"
                    position="relative"
                    backgroundColor="white"
                    opacity={1}
                    sx={{
                      "& > *": {
                        // Target all direct children
                        backgroundColor: "white !important",
                        opacity: "1 !important",
                      },
                      "& .chakra-menu__group": {
                        backgroundColor: "white !important",
                      },
                      "& .chakra-menu__menu-item": {
                        backgroundColor: "white !important",
                        opacity: "1 !important",
                      },
                    }}
                  >
                    {/* Only show Admin Dashboard for superAdmin */}
                    {userRole === "superAdmin" && (
                      <>
                        <MenuGroup 
                          title="Admin Options" 
                          color="purple.600" 
                          fontWeight="bold"
                        >
                          <MenuItem
                            icon={
                              <Icon
                                as={MdDashboard}
                                boxSize={5}
                                color="purple.500"
                              />
                            }
                            onClick={() => navigate("/admin")}
                            bg="purple.50"
                            color="purple.700"
                            _hover={{ bg: "purple.100" }}
                            fontWeight="500"
                            borderLeft="4px solid"
                            borderColor="purple.500"
                            paddingLeft="4"
                            transition="all 0.2s"
                          >
                            Admin Dashboard
                          </MenuItem>
                        </MenuGroup>
                        <MenuDivider borderColor="purple.200" />
                      </>
                    )}

                    {/* Add Resource option for admins and superAdmins */}
                    {canAddResource() && (
                      <MenuItem
                        onClick={handleAddResource}
                        icon={
                          <Icon as={GiBookshelf} boxSize={5} color="teal.500" />
                        }
                        bg="teal.50"
                        color="teal.700"
                        _hover={{ bg: "teal.100" }}
                        fontWeight="500"
                        borderLeft="4px solid"
                        borderColor="teal.500"
                        paddingLeft="4"
                        transition="all 0.2s"
                      >
                        Add Resource
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
              )}

              {/* Clerk User Button with its own dropdown */}
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: "40px",
                      height: "40px",
                      background: "transparent",
                    },
                    userButtonPopoverCard: {
                      border: "1px solid",
                      borderColor: "gray.200",
                      boxShadow: "lg",
                      backgroundColor: "white",
                      zIndex: 1500,
                      position: "relative",
                      opacity: 1,
                    },
                    userButtonPopoverActionButton: {
                      fontWeight: "500",
                      backgroundColor: "white",
                      opacity: 1,
                      color: "#1A202C",
                      "&:hover": {
                        backgroundColor: "rgba(99, 102, 241, 0.1)",
                        color: "purple.600",
                      },
                    },
                    userButtonPopoverActionButtonIcon: {
                      color: "purple.500",
                      marginRight: "12px",
                      width: "20px",
                      height: "20px",
                      opacity: 1,
                    },
                    userButtonPopoverFooter: {
                      backgroundColor: "white",
                      opacity: 1,
                    },
                    userPreviewMainIdentifier: {
                      color: "#1A202C",
                      opacity: 1,
                    },
                    userPreviewSecondaryIdentifier: {
                      color: "#4A5568",
                      opacity: 1,
                    },
                    userButtonPopoverActionButtonText: {
                      color: "#1A202C",
                      opacity: 1,
                    },
                  },
                  variables: {
                    colorBackground: "white",
                    colorText: "#1A202C",
                    colorPrimary: "#6B46C1",
                  },
                }}
              />
            </Flex>
          ) : (
            <SignInButton mode="modal">
              <Button
                bg="white"
                color="purple.700"
                size={{ base: "sm", md: "md" }}
                _hover={{ bg: "gray.100" }}
                _active={{ bg: "gray.200" }}
                leftIcon={<Icon as={FiChevronDown} />}
                fontWeight="500"
                boxShadow="0 2px 4px rgba(0,0,0,0.2)"
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
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
  useBreakpointValue,
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
import MobileNavigation from "./MobileNavigation";

// API base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

const Header = () => {
  const { isSignedIn, user } = useUser();
  const { authFetch } = useAuthFetch();
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  // Responsive values
  const isMobile = useBreakpointValue({ base: true, md: false });
  const logoSize = useBreakpointValue({
    base: "sm" as const,
    md: "md" as const,
  });
  const buttonSize = useBreakpointValue({
    base: "sm" as const,
    md: "md" as const,
  });


  // Update user role whenever user or signin status changes
  useEffect(() => {
    const getUserRole = async () => {
      if (isSignedIn) {
        try {
          const userData = await authFetch(`${API_BASE_URL}/users/current`);
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
      px={{ base: 3, md: 4 }}
      boxShadow="0 4px 6px rgba(0,0,0,0.1)"
      position="sticky"
      top={0}
      zIndex={1100}
      isolation="isolate"
      minH={{ base: "60px", md: "64px" }}
      overflow="visible"
    >
      <Flex
        h={{ base: "60px", md: "64px" }}
        alignItems="center"
        justifyContent="space-between"
        position="relative"
        maxW="100%"
        overflow="visible"
      >
        {/* Left side - Mobile menu + Logo */}
        <Flex alignItems="center" gap={{ base: 2, md: 4 }} flex="1" minW="0">
          {/* Mobile Navigation */}
          {isMobile && isSignedIn && (
            <MobileNavigation
              userRole={userRole}
              canAddResource={canAddResource()}
              onAddResource={handleAddResource}
            />
          )}

          {/* Logo */}
          <Box minW="0" flex="1">
            <Logo
              size={logoSize}
              variant="default"
              showIcon={true}
              showTagline={false}
              color="white"
              iconColor="yellow.300"
              to="/"
            />
          </Box>
        </Flex>

        {/* Right side - User controls */}
        <Flex
          alignItems="center"
          gap={{ base: 1, md: 3 }}
          flexShrink={0}
          pr={{ base: 2, md: 4 }}
        >
          {isSignedIn ? (
            <Flex alignItems="center" gap={{ base: 1, md: 3 }}>
              {/* Role Tag - Hidden on mobile for space */}
              {userRole && !isMobile && (
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
                  size={buttonSize}
                  p={2}
                  boxShadow="0 2px 4px rgba(0,0,0,0.2)"
                  display={{ base: "none", md: "flex" }}
                >
                  <HStack spacing={1}>
                    {getRoleIcon(userRole) && (
                      <Icon
                        as={getRoleIcon(userRole)}
                        boxSize={4}
                        color="yellow.300"
                      />
                    )}
                  </HStack>
                </Tag>
              )}

              {/* Desktop Navigation Menu */}
              {userRole && userRole !== "user" && !isMobile && (
                <Box position="relative">
                  <Menu
                    placement="bottom-end"
                    offset={isMobile ? [-10, 8] : [-40, 8]}
                  >
                    <MenuButton
                      as={Button}
                      size={buttonSize}
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
                      zIndex={1500}
                      bg="white"
                      shadow="xl"
                      border="none"
                      borderRadius="md"
                      backgroundColor="white"
                      opacity={1}
                      minW="220px"
                      maxW="280px"
                      sx={{
                        "& > *": {
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

                      {canAddResource() && (
                        <MenuItem
                          onClick={handleAddResource}
                          icon={
                            <Icon
                              as={GiBookshelf}
                              boxSize={5}
                              color="teal.500"
                            />
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
                </Box>
              )}

              {/* User Button */}
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: {
                      width: isMobile ? "32px" : "40px",
                      height: isMobile ? "32px" : "40px",
                      background: "transparent",
                    },
                    userButtonPopoverCard: {
                      border: "1px solid",
                      borderColor: "gray.200",
                      boxShadow: "lg",
                      backgroundColor: "white",
                      zIndex: "1500 !important",
                      position: "absolute !important",
                      opacity: "1 !important",
                      overflow: "visible",
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
                size={buttonSize}
                _hover={{ bg: "gray.100" }}
                _active={{ bg: "gray.200" }}
                leftIcon={!isMobile ? <Icon as={FiChevronDown} /> : undefined}
                fontWeight="500"
                boxShadow="0 2px 4px rgba(0,0,0,0.2)"
                px={{ base: 3, md: 4 }}
              >
                {isMobile ? "Sign In" : "Sign In"}
              </Button>
            </SignInButton>
          )}
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;

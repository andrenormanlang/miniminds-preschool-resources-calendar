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
  HStack,
  useColorModeValue,
  MenuGroup,
} from "@chakra-ui/react";
import { FiChevronDown, FiHome, FiMoreVertical } from "react-icons/fi";
import {
  GiBookshelf,
  GiBrain,
  GiCaptainHatProfile,
  GiCrown,
  GiStarFormation,
  GiGraduateCap,
} from "react-icons/gi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { useAuthFetch } from "../utils/authUtils";
import {
  ViewIcon,
  SettingsIcon,
  AddIcon,
  LockIcon,
  ViewOffIcon,
  CheckIcon,
  CloseIcon,
  TimeIcon,
} from "@chakra-ui/icons";
import { MdDashboard } from "react-icons/md";

const Header = () => {
  const { isSignedIn, user } = useUser();
  const { authFetch } = useAuthFetch();
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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
  const formatRoleDisplay = (role: string) => {
    if (role.toLowerCase() === "superadmin") {
      return "Super Admin";
    } else if (role.toLowerCase() === "admin") {
      return "Admin";
    }
    return role;
  };

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

  const handleFilterChange = (filter: "all" | "mine") => {
    setSearchParams({ filter });
    navigate(`/?filter=${filter}`);
  };

  return (
    <Box
      bg="linear-gradient(135deg, #6B46C1 0%, #9F7AEA 100%)"
      px={4}
      boxShadow="0 4px 6px rgba(0,0,0,0.1)"
      position="sticky"
      top={0}
      zIndex={10}
    >
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Logo - colorful and kid-friendly */}
        <Box>
          <RouterLink to="/">
            <HStack spacing={2}>
              <Icon as={GiBrain} boxSize={8} color="yellow.300" />
              <Heading
                size="lg"
                fontFamily="Montserrat Alternates"
                fontWeight="800"
                color="white"
                textShadow="1px 1px 2px rgba(0,0,0,0.3)"
              >
                MiniMinds
              </Heading>
            </HStack>
          </RouterLink>
        </Box>

        {/* User Authentication */}
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
                    <Text>{formatRoleDisplay(userRole)}</Text>
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
                    bg="whiteAlpha.300"
                    color="white"
                    _hover={{ bg: "whiteAlpha.400" }}
                    _active={{ bg: "whiteAlpha.500" }}
                    minW="auto"
                    p={1.5}
                    borderRadius="full"
                  >
                    <FiMoreVertical />
                  </MenuButton>
                  <MenuList
                    zIndex={100}
                    bg="white"
                    shadow="xl"
                    border="none"
                    borderRadius="md"
                  >
                    {/* Filter Options - Show for admin and superAdmin */}
                    <MenuGroup title="View Options">
                      <MenuItem
                        icon={<Icon as={ViewIcon} color="purple.500" />}
                        onClick={() => handleFilterChange("all")}
                        fontWeight={
                          searchParams.get("filter") === "all"
                            ? "bold"
                            : "normal"
                        }
                      >
                        All Resources
                      </MenuItem>
                      <MenuItem
                        icon={<Icon as={GiBookshelf} color="blue.500" />}
                        onClick={() => handleFilterChange("mine")}
                        fontWeight={
                          searchParams.get("filter") === "mine"
                            ? "bold"
                            : "normal"
                        }
                      >
                        My Resources
                      </MenuItem>
                    </MenuGroup>

                    {/* Only show Admin Dashboard for superAdmin */}
                    {userRole === "superAdmin" && (
                      <>
                        <MenuDivider />
                        <MenuGroup title="Admin Options">
                          <MenuItem
                            icon={
                              <Icon
                                as={MdDashboard}
                                boxSize={5}
                                color="purple.500"
                              />
                            }
                            onClick={() => navigate("/admin")}
                          >
                            Admin Dashboard
                          </MenuItem>
                        </MenuGroup>
                      </>
                    )}

                    {/* Add Resource option for admins and superAdmins */}
                    {canAddResource() && (
                      <>
                        <MenuDivider />
                        <MenuItem
                          onClick={handleAddResource}
                          icon={
                            <Icon
                              as={GiBookshelf}
                              boxSize={5}
                              color="teal.500"
                            />
                          }
                          _hover={{ bg: "teal.50" }}
                        >
                          Add Resource
                        </MenuItem>
                      </>
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
                    },
                    userButtonPopoverActionButton: {
                      fontWeight: "500",
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
                    },
                  },
                }}
              />
            </Flex>
          ) : (
            <SignInButton mode="modal">
              <Button
                bg="whiteAlpha.300"
                color="white"
                size={{ base: "sm", md: "md" }}
                _hover={{ bg: "whiteAlpha.400" }}
                _active={{ bg: "whiteAlpha.500" }}
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

import React from "react";
import {
  Box,
  Flex,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  VStack,
  Text,
  Button,
  Icon,
  Divider,
  useColorModeValue,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { MdDashboard, MdHome, MdAdd } from "react-icons/md";
import {
  GiCrown,
  GiStarFormation,
  GiGraduateCap,
} from "react-icons/gi";
import { useNavigate } from "react-router-dom";

interface MobileNavigationProps {
  userRole: string | null;
  canAddResource: boolean;
  onAddResource: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  userRole,
  canAddResource,
  onAddResource,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "white");

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

  const getRoleColor = (role: string) => {
    if (role.toLowerCase() === "superadmin") {
      return "red.500";
    } else if (role.toLowerCase() === "admin") {
      return "blue.500";
    }
    return "green.500";
  };

  return (
    <>
      <IconButton
        aria-label="Open menu"
        icon={<HamburgerIcon />}
        onClick={onOpen}
        variant="ghost"
        color="white"
        size="lg"
        _hover={{ bg: "whiteAlpha.200" }}
        display={{ base: "flex", md: "none" }}
      />

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent bg={bgColor} maxW="280px">
          <DrawerCloseButton color={textColor} />
          <DrawerHeader color={textColor} pb={4}>
            <Text fontSize="lg" fontWeight="bold">
              MiniMinds
            </Text>
            {userRole && (
              <Flex align="center" mt={2} gap={2}>
                <Icon
                  as={getRoleIcon(userRole)}
                  color={getRoleColor(userRole)}
                  boxSize={4}
                />
                <Text fontSize="sm" color="gray.500" textTransform="capitalize">
                  {userRole === "superAdmin" ? "Super Admin" : userRole}
                </Text>
              </Flex>
            )}
          </DrawerHeader>

          <DrawerBody p={0}>
            <VStack spacing={0} align="stretch">
              <Button
                leftIcon={<Icon as={MdHome} />}
                variant="ghost"
                justifyContent="flex-start"
                p={4}
                borderRadius="none"
                onClick={() => {
                  navigate("/");
                  onClose();
                }}
                color={textColor}
                _hover={{ bg: "purple.50", color: "purple.600" }}
              >
                Home
              </Button>

              {canAddResource && (
                <Button
                  leftIcon={<Icon as={MdAdd} />}
                  variant="ghost"
                  justifyContent="flex-start"
                  p={4}
                  borderRadius="none"
                  onClick={() => {
                    onAddResource();
                    onClose();
                  }}
                  color={textColor}
                  _hover={{ bg: "teal.50", color: "teal.600" }}
                >
                  Add Resource
                </Button>
              )}

              {userRole === "superAdmin" && (
                <>
                  <Divider />
                  <Button
                    leftIcon={<Icon as={MdDashboard} />}
                    variant="ghost"
                    justifyContent="flex-start"
                    p={4}
                    borderRadius="none"
                    onClick={() => {
                      navigate("/admin");
                      onClose();
                    }}
                    color={textColor}
                    _hover={{ bg: "purple.50", color: "purple.600" }}
                  >
                    Admin Dashboard
                  </Button>
                </>
              )}

              <Divider />

              <Box p={4}>
                <Text fontSize="xs" color="gray.400" textAlign="center">
                  Educational Resource Management
                </Text>
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default MobileNavigation;

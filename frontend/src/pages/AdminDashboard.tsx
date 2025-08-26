import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Container,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import { useAuthFetch } from "../utils/authUtils";
import { Resource} from "../types/type";
import Loading from "../components/Loading";

// API base URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

interface AdminUser {
  id: number;
  clerkId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  isApproved: boolean;
}

const AdminDashboard = () => {
  const { isSignedIn } = useUser();
  const navigate = useNavigate();
  const toast = useToast();
  const { authFetch } = useAuthFetch();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pendingResources, setPendingResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch all users
      const usersData = await authFetch(`${API_BASE_URL}/users`);
      setUsers(usersData);

      // Fetch pending resources
      const pendingResourcesData = await authFetch(
        `${API_BASE_URL}/resources/admin/pending`
      );
      setPendingResources(pendingResourcesData);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        status: "error",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [authFetch, toast]);

  useEffect(() => {
    const checkAccess = async () => {
      if (!isSignedIn) {
        navigate("/");
        return;
      }

      try {
        // Verify user is superAdmin by trying to access admin-only endpoint
        await authFetch(`${API_BASE_URL}/resources/admin/pending`);

        // If that succeeded, load dashboard data
        fetchDashboardData();
      } catch (error) {
        console.error("Access check failed:", error);
        toast({
          title: "Access Denied",
          description: "You need superAdmin privileges to access this page.",
          status: "error",
          duration: 5000,
        });
        navigate("/");
      }
    };

    checkAccess();
  }, [isSignedIn, navigate, authFetch, fetchDashboardData, toast]);

  const handleApproveUser = async (userId: number) => {
    try {
      await authFetch(`${API_BASE_URL}/users/${userId}/approve`, {
        method: "PUT",
      });

      toast({
        title: "User Approved",
        status: "success",
        duration: 3000,
      });

      // Update local state
      setUsers(
        users.map((user) =>
          user.id === userId ? { ...user, isApproved: true } : user
        )
      );
    } catch (error) {
      console.error("Error approving user:", error);
      toast({
        title: "Error",
        description: "Failed to approve user",
        status: "error",
        duration: 5000,
      });
    }
  };



  const handleApproveResource = async (resourceId: number) => {
    try {
      console.log(`Approving resource with ID: ${resourceId}`);

      // Call the correct API endpoint
      const updatedResource = await authFetch(
        `${API_BASE_URL}/resources/${resourceId}/approve`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state after approval
      setPendingResources((prevResources) =>
        prevResources.filter((resource) => resource.id !== resourceId)
      );

      toast({
        title: "Resource approved",
        description: `The resource "${updatedResource.title}" has been approved.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      // Refresh the resource lists
      fetchDashboardData();
    } catch (error) {
      console.error("Error approving resource:", error);
      toast({
        title: "Error",
        description: "Failed to approve the resource.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleRejectResource = async (resourceId: number) => {
    try {
      await authFetch(`${API_BASE_URL}/resources/${resourceId}/reject`, {
        method: "PUT",
      });

      toast({
        title: "Resource Rejected",
        status: "success",
        duration: 3000,
      });

      // Remove from pending list
      setPendingResources(
        pendingResources.filter((resource) => resource.id !== resourceId)
      );
    } catch (error) {
      console.error("Error rejecting resource:", error);
      toast({
        title: "Error",
        description: "Failed to reject resource",
        status: "error",
        duration: 5000,
      });
    }
  };

  if (loading) return <Loading />;

  return (
    <Box minH="calc(100vh - 70px)" bg="gray.50" p={8}>
      <Container maxW="1200px">
        <Heading as="h1" mb={8} size="xl" color="blue.800">
          Admin Dashboard
        </Heading>

        <Tabs
          variant="enclosed"
          colorScheme="blue"
          bg="white"
          borderRadius="lg"
          boxShadow="md"
          overflow="hidden"
        >
          <TabList bg="blue.700" color="white">
            <Tab
              _selected={{ bg: "white", color: "blue.700" }}
              _hover={{ bg: "blue.600" }}
              fontWeight="medium"
            >
              Pending Resources
            </Tab>
            <Tab
              _selected={{ bg: "white", color: "blue.700" }}
              _hover={{ bg: "blue.600" }}
              fontWeight="medium"
            >
              User Management
            </Tab>
          </TabList>

          <TabPanels>
            {/* Pending Resources Tab */}
            <TabPanel>
              {loading ? (
                <Box textAlign="center" p={6}>
                  <Spinner size="xl" color="blue.500" />
                  <Text mt={4}>Loading resources...</Text>
                </Box>
              ) : pendingResources.length === 0 ? (
                <Box
                  p={6}
                  textAlign="center"
                  borderRadius="md"
                  bg="blue.50"
                  border="1px solid"
                  borderColor="blue.100"
                >
                  <Text fontSize="lg" fontWeight="medium" color="blue.700">
                    No pending resources to review
                  </Text>
                </Box>
              ) : (
                <Box overflowX="auto">
                  <Table
                    variant="simple"
                    colorScheme="blue"
                    size="md"
                    borderWidth="1px"
                    borderColor="gray.200"
                  >
                    <Thead bg="blue.700">
                      <Tr>
                        <Th color="white" fontWeight="bold">
                          Title
                        </Th>
                        <Th color="white" fontWeight="bold">
                          Type
                        </Th>
                        <Th color="white" fontWeight="bold">
                          Subject
                        </Th>
                        <Th color="white" fontWeight="bold">
                          Submitted By
                        </Th>
                        <Th color="white" fontWeight="bold">
                          Actions
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {pendingResources.map((resource, idx) => (
                        <Tr
                          key={resource.id}
                          bg={idx % 2 === 0 ? "white" : "blue.50"}
                        >
                          <Td fontWeight="medium" color="gray.900">
                            {resource.title}
                          </Td>
                          <Td color="gray.900">{resource.type}</Td>
                          <Td color="gray.900">{resource.subject}</Td>
                          <Td color="gray.900">
                            {resource.user?.firstName} {resource.user?.lastName}
                          </Td>
                          <Td>
                            <Button
                              size="sm"
                              bgColor="green.600"
                              color="white"
                              _hover={{ bgColor: "green.700" }}
                              mr={2}
                              onClick={() => handleApproveResource(resource.id)}
                            >
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              bgColor="red.600"
                              color="white"
                              _hover={{ bgColor: "red.700" }}
                              onClick={() => handleRejectResource(resource.id)}
                            >
                              Reject
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </TabPanel>

            {/* User Management Tab */}
            <TabPanel>
              {loading ? (
                <Box textAlign="center" p={6}>
                  <Spinner size="xl" color="blue.500" />
                  <Text mt={4}>Loading users...</Text>
                </Box>
              ) : (
                <Box overflowX="auto">
                  <Table
                    variant="simple"
                    colorScheme="blue"
                    size="md"
                    borderWidth="1px"
                    borderColor="gray.200"
                  >
                    <Thead bg="blue.700">
                      <Tr>
                        <Th color="white" fontWeight="bold">
                          Name
                        </Th>
                        <Th color="white" fontWeight="bold">
                          Email
                        </Th>
                        <Th color="white" fontWeight="bold">
                          Role
                        </Th>
                        <Th color="white" fontWeight="bold">
                          Status
                        </Th>
                        <Th color="white" fontWeight="bold">
                          Actions
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {users.map((user, idx) => (
                        <Tr
                          key={user.id}
                          bg={idx % 2 === 0 ? "white" : "blue.50"}
                        >
                          <Td fontWeight="medium" color="gray.900">
                            {user.firstName} {user.lastName}
                          </Td>
                          <Td color="gray.900">{user.email}</Td>
                          <Td>
                            <Badge
                              colorScheme={
                                user.role === "superAdmin"
                                  ? "red"
                                  : user.role === "admin"
                                  ? "blue"
                                  : "green"
                              }
                              py={1}
                              px={2}
                              borderRadius="md"
                              textTransform="capitalize"
                              fontWeight="medium"
                            >
                              {user.role === "superAdmin"
                                ? "Super Admin"
                                : user.role === "admin"
                                ? "Admin"
                                : "User"}
                            </Badge>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={user.isApproved ? "green" : "orange"}
                              py={1}
                              px={2}
                              borderRadius="md"
                              fontWeight="medium"
                            >
                              {user.isApproved ? "Approved" : "Pending"}
                            </Badge>
                          </Td>
                          <Td>
                            {!user.isApproved && (
                              <Button
                                size="sm"
                                bgColor="green.600"
                                color="white"
                                _hover={{ bgColor: "green.700" }}
                                onClick={() => handleApproveUser(user.id)}
                              >
                                Approve
                              </Button>
                            )}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  );
};

export default AdminDashboard;

import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Badge,
  useToast,
  Flex,
  Text,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@chakra-ui/react";
import { useUser, useAuth } from "@clerk/clerk-react";
import Loading from "../components/Loading";
import { Resource, User } from "../types/type";

const SuperAdminPage = () => {
  const [pendingResources, setPendingResources] = useState<Resource[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    if (isSignedIn) {
      fetchPendingResources();
      fetchUsers();
    }
  }, [isSignedIn]);

  const fetchPendingResources = async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token required");
      }

      const response = await fetch(
        "http://localhost:4000/api/resources/admin/pending",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch pending resources");
      }

      const data = await response.json();
      setPendingResources(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error fetching pending resources",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token required");
      }

      const response = await fetch("http://localhost:4000/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error fetching users",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleApproveResource = async (id: number, approve: boolean) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token required");
      }

      const response = await fetch(
        `http://localhost:4000/api/resources/${id}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ approve }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update resource approval status");
      }

      // Remove from pending list
      setPendingResources((prevResources) =>
        prevResources.filter((resource) => resource.id !== id)
      );

      toast({
        title: approve ? "Resource approved" : "Resource rejected",
        status: approve ? "success" : "info",
        duration: 3000,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to update approval status",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleApproveUser = async (id: number) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token required");
      }

      const response = await fetch(
        `http://localhost:4000/api/users/${id}/approve`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve user");
      }

      // Update user in the list
      setUsers(
        users.map((user) =>
          user.id === id ? { ...user, isApproved: true } : user
        )
      );

      toast({
        title: "User approved",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to approve user",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleRoleChange = async (id: number, newRole: string) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token required");
      }

      const response = await fetch(
        `http://localhost:4000/api/users/${id}/role`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update role");
      }

      // Update user in the list
      setUsers(
        users.map((user) =>
          user.id === id
            ? { ...user, role: newRole as "user" | "admin" | "superAdmin" }
            : user
        )
      );

      toast({
        title: "Role updated",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to update role",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 3000,
      });
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Box p={8}>
      <Heading mb={6} color="purple.700">
        Super Admin Dashboard
      </Heading>

      <Tabs variant="enclosed" colorScheme="purple">
        <TabList>
          <Tab>Pending Resources</Tab>
          <Tab>User Management</Tab>
        </TabList>

        <TabPanels>
          {/* Pending Resources Panel */}
          <TabPanel>
            <Box overflowX="auto">
              <Heading size="md" mb={4}>
                Resources Awaiting Approval
              </Heading>

              {pendingResources.length > 0 ? (
                <Table variant="simple" colorScheme="purple">
                  <Thead bg="purple.100">
                    <Tr>
                      <Th>Title</Th>
                      <Th>Subject</Th>
                      <Th>Age Group</Th>
                      <Th>Created By</Th>
                      <Th>Date</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {pendingResources.map((resource) => (
                      <Tr key={resource.id}>
                        <Td fontWeight="medium">{resource.title}</Td>
                        <Td>{resource.subject}</Td>
                        <Td>{resource.ageGroup}</Td>
                        <Td>
                          {users.find((u) => u.id === resource.userId)?.email ||
                            "Unknown"}
                        </Td>
                        <Td>
                          {new Date(resource.eventDate).toLocaleDateString()}
                        </Td>
                        <Td>
                          <Flex gap={2}>
                            <Button
                              colorScheme="green"
                              size="sm"
                              onClick={() =>
                                handleApproveResource(resource.id, true)
                              }
                            >
                              Approve
                            </Button>
                            <Button
                              colorScheme="red"
                              size="sm"
                              onClick={() =>
                                handleApproveResource(resource.id, false)
                              }
                            >
                              Reject
                            </Button>
                          </Flex>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              ) : (
                <Box textAlign="center" p={6} bg="gray.50" borderRadius="md">
                  <Text fontSize="lg">No resources pending approval</Text>
                </Box>
              )}
            </Box>
          </TabPanel>

          {/* User Management Panel */}
          <TabPanel>
            <Box overflowX="auto">
              <Heading size="md" mb={4}>
                User Management
              </Heading>

              {users.length > 0 ? (
                <Table variant="simple" colorScheme="purple">
                  <Thead bg="purple.100">
                    <Tr>
                      <Th>Email</Th>
                      <Th>Name</Th>
                      <Th>Role</Th>
                      <Th>Status</Th>
                      <Th>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {users.map((user) => (
                      <Tr key={user.id}>
                        <Td>{user.email}</Td>
                        <Td>{`${user.firstName || ""} ${
                          user.lastName || ""
                        }`}</Td>
                        <Td>
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user.id, e.target.value)
                            }
                            style={{
                              padding: "5px",
                              borderRadius: "4px",
                              border: "1px solid #E2E8F0",
                            }}
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                            <option value="superAdmin">Super Admin</option>
                          </select>
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={user.isApproved ? "green" : "yellow"}
                          >
                            {user.isApproved ? "Approved" : "Pending"}
                          </Badge>
                        </Td>
                        <Td>
                          {!user.isApproved && (
                            <Button
                              colorScheme="green"
                              size="sm"
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
              ) : (
                <Box textAlign="center" p={6} bg="gray.50" borderRadius="md">
                  <Text fontSize="lg">No users found</Text>
                </Box>
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default SuperAdminPage;

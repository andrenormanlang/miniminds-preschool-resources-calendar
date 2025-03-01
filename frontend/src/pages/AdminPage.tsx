import { useState, useEffect } from 'react';
import {
    Box, Heading, Table, Thead, Tbody, Tr, Th, Td, 
    Button, Select, useToast, Text
  } from '@chakra-ui/react';
import { useUser } from '@clerk/clerk-react'; // Import useUser instead of useAuth
import Loading from '../components/Loading';

type User = {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  isApproved: boolean;
};

const AdminPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { user, isSignedIn } = useUser(); // Use the useUser hook from Clerk

  useEffect(() => {
    if (isSignedIn) {
      fetchUsers();
    }
  }, [isSignedIn]);

  const fetchUsers = async () => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Failed to get authentication token");
      }
      
      const response = await fetch('http://localhost:4000/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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
    } finally {
      setLoading(false);
    }
  };

  const getToken = async () => {
    if (!isSignedIn) return null;
    try {
      return await user?.getToken();
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  };

  const handleApproveUser = async (id: number) => {
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token not available");
      }
      
      const response = await fetch(`http://localhost:4000/api/users/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error("Failed to approve user");
      }
      
      setUsers(users.map(user => 
        user.id === id ? { ...user, isApproved: true } : user
      ));
      
      toast({
        title: "User approved.",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to approve user.",
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
        throw new Error("Authentication token not available");
      }
      
      const response = await fetch(`http://localhost:4000/api/users/${id}/role`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });
      
      if (!response.ok) {
        throw new Error("Failed to update role");
      }
      
      setUsers(users.map(user => 
        user.id === id ? { ...user, role: newRole } : user
      ));
      
      toast({
        title: "Role updated.",
        status: "success",
        duration: 3000,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to update role.",
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
      <Heading mb={6}>User Management</Heading>
      
      {users.length > 0 ? (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Email</Th>
              <Th>Name</Th>
              <Th>Role</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map(user => (
              <Tr key={user.id}>
                <Td>{user.email}</Td>
                <Td>{`${user.firstName || ''} ${user.lastName || ''}`}</Td>
                <Td>
                  <Select 
                    value={user.role} 
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </Select>
                </Td>
                <Td>{user.isApproved ? 'Approved' : 'Pending'}</Td>
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
          <Heading size="md" mb={4}>No users found</Heading>
          <Text>There are currently no users in the system.</Text>
        </Box>
      )}
    </Box>
  );
};

export default AdminPage;
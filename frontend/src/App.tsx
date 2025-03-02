import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { ChakraProvider } from '@chakra-ui/react';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import SuperAdminPage from './pages/SuperAdminPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import { Box, Button } from '@chakra-ui/react';
import './App.css';
import Loading from './components/Loading';
import { useState } from 'react';
import AdminDashboard from './pages/AdminDashboard';

const App = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncUserWithBackend = async () => {
      if (isSignedIn && user) {
        try {
          // Use the user ID directly
          const response = await fetch('http://localhost:4000/api/users/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.id}`  // Use ID instead of token
            },
            body: JSON.stringify({
              clerkId: user.id,
              email: user.primaryEmailAddress?.emailAddress,
              firstName: user.firstName,
              lastName: user.lastName
            })
          });
          
          if (!response.ok) {
            throw new Error('Failed to sync user with backend');
          }
          
          console.log('User synced successfully with backend');
          
        } catch (err) {
          console.error('Error syncing user:', err);
        }
      }
    };
    
    syncUserWithBackend();
  }, [isSignedIn, user]);

  useEffect(() => {
    // Synchronize role metadata from Clerk to your database
    const syncRoleMetadata = async () => {
      if (isSignedIn && user) {
        try {
          // Use user ID directly
          const response = await fetch(`http://localhost:4000/api/users/current`, {
            headers: {
              'Authorization': `Bearer ${user.id}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            
            // Check if the role in your DB matches the role in Clerk
            const clerkRole = user.publicMetadata.role;
            
            if (userData.role !== clerkRole || userData.isApproved !== user.publicMetadata.isApproved) {
              // Update Clerk with the role from your database
              await user.update({
                publicMetadata: {
                  ...user.publicMetadata,
                  role: userData.role,
                  isApproved: userData.isApproved
                }
              });
              
              console.log('Updated Clerk metadata with role:', userData.role);
            }
          } else {
            console.error('Failed to fetch user data from backend');
          }
        } catch (err) {
          console.error('Error syncing roles:', err);
        }
      }
    };
    
    syncRoleMetadata();
  }, [isSignedIn, user]);

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <ChakraProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          {/* Admin route for resource management */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* SuperAdmin route for approvals */}
          <Route path="/superadmin" element={
            <ProtectedRoute requiredRole="superAdmin">
              <SuperAdminPage />
            </ProtectedRoute>
          } />
          
          <Route path="/unauthorized" element={<UnauthorizedPage />} />
        </Routes>
        
        {/* Global Message Display for Errors */}
        {error && (
          <Box 
            position="fixed" 
            bottom={4} 
            right={4} 
            bg="red.500" 
            color="white" 
            p={3} 
            borderRadius="md"
            boxShadow="lg"
          >
            {error}
            <Button 
              size="sm" 
              ml={2} 
              onClick={() => setError(null)}
            >
              Close
            </Button>
          </Box>
        )}
      </Router>
    </ChakraProvider>
  );
};

export default App;
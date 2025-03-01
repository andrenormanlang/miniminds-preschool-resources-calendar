// src/App.tsx
import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import { Box, Button } from '@chakra-ui/react';
import './App.css';
import Loading from './components/Loading';
import { useState } from 'react';

const App = () => {
  const { isLoaded, isSignedIn, user } = useUser(); // Fix: properly destructure all needed values
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const syncUserWithBackend = async () => {
      if (isSignedIn && user) {
        try {
          const token = await user.getToken();
          
          const response = await fetch('http://localhost:4000/api/users/sync', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
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
          // Don't show error to user as this is a background operation
        }
      }
    };
    
    syncUserWithBackend();
  }, [isSignedIn, user]);

  if (!isLoaded) {
    return <Loading />;
  }

  return (
    <Router>
      <Header />
      <Routes>
        {/* Use the HomePage component directly instead of ResourcesView */}
        <Route path="/" element={<HomePage />} />
        <Route path="/admin" element={
          <ProtectedRoute requiredRole="admin">
            <AdminPage />
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
  );
};

export default App;
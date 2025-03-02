import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useToast } from '@chakra-ui/react';

interface ResourceApprovalContextType {
  approveResource: (resourceId: number) => Promise<boolean>;
  rejectResource: (resourceId: number) => Promise<boolean>;
  isProcessing: boolean;
}

const ResourceApprovalContext = createContext<ResourceApprovalContextType | undefined>(undefined);

export const ResourceApprovalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, isSignedIn } = useUser();
  const toast = useToast();

  const getToken = async () => {
    if (!isSignedIn) return null;
    try {
      return await user?.getToken();
    } catch (error) {
      console.error("Error getting auth token:", error);
      return null;
    }
  };

  const approveResource = async (resourceId: number): Promise<boolean> => {
    setIsProcessing(true);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token required");
      }

      const response = await fetch(`http://localhost:4000/api/resources/${resourceId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ approve: true })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to approve resource');
      }

      toast({
        title: "Resource approved",
        status: "success",
        duration: 3000,
      });
      
      return true;
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to approve resource",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const rejectResource = async (resourceId: number): Promise<boolean> => {
    setIsProcessing(true);
    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Authentication token required");
      }

      const response = await fetch(`http://localhost:4000/api/resources/${resourceId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ approve: false })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to reject resource');
      }

      toast({
        title: "Resource rejected",
        status: "info",
        duration: 3000,
      });
      
      return true;
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to reject resource",
        description: error instanceof Error ? error.message : "Unknown error",
        status: "error",
        duration: 5000,
      });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ResourceApprovalContext.Provider value={{ approveResource, rejectResource, isProcessing }}>
      {children}
    </ResourceApprovalContext.Provider>
  );
};

export const useResourceApproval = () => {
  const context = useContext(ResourceApprovalContext);
  if (context === undefined) {
    throw new Error('useResourceApproval must be used within a ResourceApprovalProvider');
  }
  return context;
};
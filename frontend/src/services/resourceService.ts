const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

export interface Resource {
  id: number;
  title: string;
  type: string;
  subject: string;
  ageGroup: string;
  description?: string;
  eventDate: string;
  imageUrl?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  userId: number;
  user?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface CreateResourceData {
  title: string;
  type: string;
  subject: string;
  ageGroup: string;
  description?: string;
  eventDate: string;
  imageUrl?: string;
}

// Create a function that takes the getToken function as parameter
export const createResourceService = (
  getToken: () => Promise<string | null>
) => {
  const getAuthHeaders = async () => {
    try {
      const token = await getToken();
      return {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };
    } catch (error) {
      console.error("Error getting auth token:", error);
      return {
        "Content-Type": "application/json",
      };
    }
  };

  return {
    async getAllResources(approved: boolean = true): Promise<Resource[]> {
      try {
        const endpoint = `${API_BASE_URL}/api/resources?approved=${approved}`;

        const headers = await getAuthHeaders();
        const response = await fetch(endpoint, { headers });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error("Error fetching resources:", error);
        throw error;
      }
    },

    async createResource(resourceData: CreateResourceData): Promise<Resource> {
      try {
        const headers = await getAuthHeaders();
        const response = await fetch(`${API_BASE_URL}/api/resources`, {
          method: "POST",
          headers,
          body: JSON.stringify(resourceData),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error("Error creating resource:", error);
        throw error;
      }
    },

    async approveResource(id: number): Promise<Resource> {
      try {
        const headers = await getAuthHeaders();
        const response = await fetch(
          `${API_BASE_URL}/api/resources/${id}/approve`,
          {
            method: "PATCH",
            headers,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error("Error approving resource:", error);
        throw error;
      }
    },

    async rejectResource(id: number): Promise<void> {
      try {
        const headers = await getAuthHeaders();
        const response = await fetch(
          `${API_BASE_URL}/api/resources/${id}/reject`,
          {
            method: "PUT",
            headers,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error("Error rejecting resource:", error);
        throw error;
      }
    },

    async getPendingResources(): Promise<Resource[]> {
      return this.getAllResources(false);
    },

    async getApprovedResources(): Promise<Resource[]> {
      return this.getAllResources(true);
    },
  };
};

// Default export for backward compatibility
export const resourceService = createResourceService(async () => {
  // Fallback implementation
  try {
    return (await (window as unknown as { Clerk?: { session?: { getToken: () => Promise<string> } } }).Clerk?.session?.getToken()) || null;
  } catch {
    return null;
  }
});

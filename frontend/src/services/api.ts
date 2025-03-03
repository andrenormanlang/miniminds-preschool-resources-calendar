import { useAuthFetch } from "../utils/authUtils";
import { Resource } from "../types/type";

const BASE_URL = "http://localhost:4000/api";

export const useResourceApi = () => {
  const { authFetch } = useAuthFetch();

  return {
    // Get all resources
    getAllResources: async () => {
      const response = await fetch(`${BASE_URL}/resources`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    },

    // Get user's resources
    getUserResources: async () => {
      return authFetch(`${BASE_URL}/resources/admin/mine`);
    },

    // Get current user info
    getCurrentUser: async () => {
      return authFetch(`${BASE_URL}/users/current`);
    },

    // Create resource
    createResource: async (data: Omit<Resource, "id">) => {
      return authFetch(`${BASE_URL}/resources`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    // Update resource
    updateResource: async (id: number, data: Partial<Resource>) => {
      return authFetch(`${BASE_URL}/resources/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });
    },

    // Delete resource
    deleteResource: async (id: number) => {
      return authFetch(`${BASE_URL}/resources/${id}`, {
        method: "DELETE",
      });
    },
  };
};

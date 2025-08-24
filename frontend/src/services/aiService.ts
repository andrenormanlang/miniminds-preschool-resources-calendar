import { useUser } from "@clerk/clerk-react";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export interface AIService {
  generateSuggestions: (
    ageGroup: string,
    subject: string,
    type: string
  ) => Promise<any>;
  getPersonalizedRecommendations: () => Promise<any>;
  answerQuestion: (question: string, context?: string) => Promise<string>;
  enhanceDescription: (
    title: string,
    description: string,
    type: string,
    ageGroup: string,
    subject: string
  ) => Promise<string>;
  chat: (message: string, conversationHistory?: any[]) => Promise<string>;
  chatStream: (
    message: string,
    conversationHistory?: any[],
    onChunk?: (chunk: string) => void
  ) => Promise<string>;
}

export const useAIService = (): AIService => {
  const { user, isSignedIn } = useUser();

  const getAuthHeaders = async () => {
    if (!isSignedIn || !user) {
      throw new Error("User not authenticated");
    }

    const token = user.id; // Using Clerk user ID as the token
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  };

  const generateSuggestions = async (
    ageGroup: string,
    subject: string,
    type: string
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ageGroup, subject, type }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate suggestions");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error generating suggestions:", error);
      throw error;
    }
  };

  const getPersonalizedRecommendations = async () => {
    try {
      const headers = await getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/ai/recommendations`, {
        method: "POST",
        headers,
      });

      if (!response.ok) {
        throw new Error("Failed to get recommendations");
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error getting recommendations:", error);
      throw error;
    }
  };

  const answerQuestion = async (question: string, context?: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question, context }),
      });

      if (!response.ok) {
        throw new Error("Failed to get answer");
      }

      const data = await response.json();
      return data.data.answer;
    } catch (error) {
      console.error("Error getting answer:", error);
      throw error;
    }
  };

  const enhanceDescription = async (
    title: string,
    description: string,
    type: string,
    ageGroup: string,
    subject: string
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/enhance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, type, ageGroup, subject }),
      });

      if (!response.ok) {
        throw new Error("Failed to enhance description");
      }

      const data = await response.json();
      return data.data.enhancedDescription;
    } catch (error) {
      console.error("Error enhancing description:", error);
      throw error;
    }
  };

  const chat = async (message: string, conversationHistory?: any[]) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, conversationHistory }),
      });

      if (!response.ok) {
        throw new Error("Failed to get chat response");
      }

      const data = await response.json();
      return data.data.response;
    } catch (error) {
      console.error("Error in chat:", error);
      throw error;
    }
  };

  const chatStream = async (
    message: string,
    conversationHistory?: any[],
    onChunk?: (chunk: string) => void
  ) => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, conversationHistory }),
      });

      if (!response.ok) {
        throw new Error("Failed to start chat stream");
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No reader available");
      }

      let fullResponse = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.error) {
                throw new Error(data.error);
              }

              if (onChunk && data.content) {
                onChunk(data.content);
              }

              if (data.done) {
                fullResponse = data.content;
                return fullResponse;
              }
            } catch (parseError) {
              console.warn("Failed to parse SSE data:", parseError);
            }
          }
        }
      }

      return fullResponse;
    } catch (error) {
      console.error("Error in chat stream:", error);
      throw error;
    }
  };

  return {
    generateSuggestions,
    getPersonalizedRecommendations,
    answerQuestion,
    enhanceDescription,
    chat,
    chatStream,
  };
};

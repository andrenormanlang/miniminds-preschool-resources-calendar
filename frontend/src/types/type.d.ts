export interface Resource {
  id: number;
  title: string;
  description: string;
  type: string;
  subject: string;
  ageGroup: string;
  eventDate: string;
  imageUrl?: string;
  userId?: number;
  isApproved?: boolean;
  // Add the user property
  user?: {
    firstName?: string;
    lastName?: string;
  };
}

export type User = {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: 'user' | 'admin' | 'superAdmin';
  isApproved: boolean;
};




export type EventFormData = {
  title: string;
  type: string;
  subject: string;
  ageGroup: string;
  description: string;
  eventDate: string;
  imageUrl: string;
}

export interface AISuggestion {
  title: string;
  description: string;
  type: string;
  subject: string;
  ageGroup: string;
  materials?: string;
  objectives?: string;
  safety?: string;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  type: string;
  subject: string;
  ageGroup: string;
  score: number;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
}

export interface AIEnhancementResult {
  title: string;
  description: string;
}

export interface AISuggestionsResponse {
  suggestions?: AISuggestion[] | string;
}

export type AISuggestionsResult = AISuggestion[] | AISuggestionsResponse | string;

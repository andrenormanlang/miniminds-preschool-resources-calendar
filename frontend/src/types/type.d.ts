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

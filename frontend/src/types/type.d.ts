export type Resource = {
  id: number;
  title: string;
  type: string; 
  subject: string;
  ageGroup: string;
  rating: number;
  description: string;
  eventDate: string;
  imageUrl: string;
  isApproved: boolean;
  userId?: number;
};

export type User = {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: 'user' | 'admin' | 'superAdmin';
  isApproved: boolean;
};
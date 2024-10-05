import { Request } from 'express';

declare module 'express' {
export type Resource = {
  id: number;
  title: string;
  type: string;
  subject: string;
  ageGroup: string;
  rating: number;
  link?: string;
}

}
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

// Extended Request interface
interface AuthRequest extends Request {
  user?: {
    id: number;
    clerkId: string;
    role: string;
    isApproved: boolean;
  };
}

const CLERK_PEM_KEY = process.env.CLERK_PEM_KEY || '';

// Cache for the JWK keys
let jwks: any = null;
let lastFetched = 0;

const fetchJwks = async () => {
  // Only fetch if we haven't fetched in the last hour
  if (jwks && Date.now() - lastFetched < 3600000) {
    return jwks;
  }
  
  const response = await fetch('https://clerk.vast-civet-74.accounts.dev/.well-known/jwks.json');
  jwks = await response.json();
  lastFetched = Date.now();
  return jwks;
};

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded: any = jwt.verify(token, CLERK_PEM_KEY, { algorithms: ['RS256'] });
    
    // Find the user in our database by clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: decoded.sub }
    });

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    // Add user info to the request
    req.user = {
      id: user.id,
      clerkId: user.clerkId,
      role: user.role,
      isApproved: user.isApproved
    };
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const isAdmin = [
  requireAuth,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  }
];

export const isApproved = [
  requireAuth,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user?.isApproved) {
      return res.status(403).json({ message: 'Account not approved yet' });
    }
    next();
  }
];
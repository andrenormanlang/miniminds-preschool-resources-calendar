import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

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

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Extract Clerk user ID from the header instead of verifying JWT
    const clerkId = authHeader.split(' ')[1];
    
    if (!clerkId) {
      return res.status(401).json({ message: 'Invalid authentication' });
    }
    
    // Find the user in our database by clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId }
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
    res.status(401).json({ message: 'Authentication failed' });
  }
};

// For superAdmin only routes
export const isSuperAdmin = [
  requireAuth,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'superAdmin') {
      return res.status(403).json({ message: 'SuperAdmin access required' });
    }
    next();
  }
];

// For admin or superAdmin routes
export const isAdminOrSuperAdmin = [
  requireAuth,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin' && req.user?.role !== 'superAdmin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    next();
  }
];

// For approved users (any role)
export const isApproved = [
  requireAuth,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user?.isApproved) {
      return res.status(403).json({ message: 'Account not approved yet' });
    }
    next();
  }
];

export const isAdmin = isAdminOrSuperAdmin;
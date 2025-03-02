import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Interface for authenticated requests
interface AuthRequest extends Request {
  user?: {
    id: number;
    clerkId: string;
    role: string;
    isApproved: boolean;
  };
}

export const createOrUpdateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { clerkId, email, firstName, lastName } = req.body;

    const user = await prisma.user.upsert({
      where: { clerkId },
      update: { email, firstName, lastName },
      create: { 
        clerkId, 
        email, 
        firstName, 
        lastName, 
        role: 'user', // Default role is "user"
        isApproved: false // New users need to be approved
      }
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const approveUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { isApproved: true }
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const setUserRole = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    // Validate that the role is one of the allowed values
    if (!['user', 'admin', 'superAdmin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }
    
    // Only superAdmin can create another superAdmin
    if (role === 'superAdmin' && req.user?.role !== 'superAdmin') {
      return res.status(403).json({ message: 'Only superAdmin can create another superAdmin' });
    }
    
    const user = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { role }
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

export const getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = await prisma.user.findUnique({
      where: { id: req.user.id }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const manualCreateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { clerkId, email, firstName, lastName, role } = req.body;
    
    // Validate required fields
    if (!clerkId || !email) {
      return res.status(400).json({ message: 'clerkId and email are required' });
    }

    // Validate role
    if (role && !['user', 'admin', 'superAdmin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Create user with optional role
    const user = await prisma.user.create({
      data: {
        clerkId,
        email,
        firstName: firstName || null,
        lastName: lastName || null,
        role: role || 'user',
        isApproved: role === 'superAdmin' // Auto-approve superAdmins
      }
    });

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const syncClerkUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { clerkId, email, firstName, lastName } = req.body;
    
    if (!clerkId || !email) {
      return res.status(400).json({ message: 'clerkId and email are required' });
    }
    
    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { clerkId }
    });
    
    if (existingUser) {
      // Update existing user
      const updatedUser = await prisma.user.update({
        where: { clerkId },
        data: { email, firstName, lastName }
      });
      
      return res.json({ 
        user: updatedUser, 
        message: 'User updated successfully' 
      });
    } else {
      // Create new user
      const newUser = await prisma.user.create({
        data: {
          clerkId,
          email,
          firstName,
          lastName,
          role: 'user', // Default role
          isApproved: false // Default approval status
        }
      });
      
      return res.status(201).json({ 
        user: newUser, 
        message: 'User created successfully' 
      });
    }
  } catch (error) {
    next(error);
  }
};
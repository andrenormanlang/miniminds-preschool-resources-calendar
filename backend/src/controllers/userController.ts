// backend/src/controllers/userController.ts
import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createOrUpdateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { clerkId, email, firstName, lastName } = req.body;

    const user = await prisma.user.upsert({
      where: { clerkId },
      update: { email, firstName, lastName },
      create: { clerkId, email, firstName, lastName }
    });

    res.json(user);
  } catch (error) {
    next(error);
  }
};

export const approveUser = async (req: Request, res: Response, next: NextFunction) => {
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

export const setUserRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
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

// testing the webhook
export const manualCreateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { clerkId, email, firstName, lastName, role } = req.body;
      
      // Validate required fields
      if (!clerkId || !email) {
        return res.status(400).json({ message: 'clerkId and email are required' });
      }
  
      // Create user with optional role
      const user = await prisma.user.create({
        data: {
          clerkId,
          email,
          firstName: firstName || null,
          lastName: lastName || null,
          role: role || 'user',
          isApproved: role === 'admin' // Auto-approve admins
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
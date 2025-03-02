import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import * as clerkClient from "@clerk/clerk-sdk-node";

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

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const clerkId = authHeader.split(" ")[1];

    // Find user in our database
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Set user in request object
    req.user = {
      id: user.id,
      clerkId: user.clerkId,
      role: user.role,
      isApproved: user.isApproved,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Authentication failed" });
  }
};

// Role-based access control middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. You do not have the required permissions.",
      });
    }

    next();
  };
};

// Approved user check middleware
export const requireApproved = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (!req.user.isApproved) {
    return res.status(403).json({
      message: "Account not yet approved. Please wait for admin approval.",
    });
  }

  next();
};

// For superAdmin only routes
export const isSuperAdmin = [
  requireAuth,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== "superAdmin") {
      return res.status(403).json({ message: "SuperAdmin access required" });
    }
    next();
  },
];

// For admin or superAdmin routes
export const isAdminOrSuperAdmin = [
  requireAuth,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== "admin" && req.user?.role !== "superAdmin") {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  },
];

// For approved users (any role)
export const isApproved = [
  requireAuth,
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user?.isApproved) {
      return res.status(403).json({ message: "Account not approved yet" });
    }
    next();
  },
];

export const isAdmin = isAdminOrSuperAdmin;

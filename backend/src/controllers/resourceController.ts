import { Request, Response, NextFunction } from "express";
import * as resourceService from "../services/resourceService.js";
import { validationResult } from "express-validator";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Extended request interface for auth
interface AuthRequest extends Request {
  user?: {
    id: number;
    clerkId: string;
    role: string;
    isApproved: boolean;
  };
}

export const getAllResources = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Regular users only see approved resources
    const resources = await resourceService.getAllResources(true);
    res.json(resources);
  } catch (error) {
    next(error);
  }
};

export const getAllResourcesAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // SuperAdmin can see all resources
    const isSuperAdmin = req.user?.role === "superAdmin";
    const resources = isSuperAdmin
      ? await resourceService.getAllResources(false)
      : await resourceService.getUserResources(req.user?.id || 0);
    res.json(resources);
  } catch (error) {
    next(error);
  }
};

export const getPendingResources = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Only superAdmin can see pending resources
    const resources = await resourceService.getPendingResources();
    res.json(resources);
  } catch (error) {
    next(error);
  }
};

export const getUserResources = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id || 0;
    const resources = await resourceService.getUserResources(userId);
    res.json(resources);
  } catch (error) {
    next(error);
  }
};

export const getResourceById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resource = await resourceService.getResourceById(
      parseInt(req.params.id)
    );
    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }
    res.json(resource);
  } catch (error) {
    next(error);
  }
};

export const createResource = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Get user ID and role if authenticated
    const userId = req.user?.id;
    const userRole = req.user?.role || "user";

    // Auto-approve if created by superAdmin
    const autoApprove = userRole === "superAdmin";

    // Create the resource
    const resource = await resourceService.createResource(
      req.body,
      userId,
      autoApprove
    );

    res.status(201).json(resource);
  } catch (error) {
    next(error);
  }
};

export const updateResource = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role || "user";

    const resource = await resourceService.updateResource(
      parseInt(req.params.id),
      req.body,
      userId,
      userRole
    );
    res.json(resource);
  } catch (error) {
    next(error);
  }
};

export const approveResource = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const resourceId = parseInt(req.params.id);

    if (!resourceId || isNaN(resourceId)) {
      return res.status(400).json({ message: "Invalid resource ID" });
    }

    // Check if resource exists
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Update resource approval status
    const updatedResource = await prisma.resource.update({
      where: { id: resourceId },
      data: { isApproved: true },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            role: true,
          },
        },
      },
    });

    return res.status(200).json(updatedResource);
  } catch (error) {
    next(error);
  }
};

export const deleteResource = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role || "user";

    await resourceService.deleteResource(
      parseInt(req.params.id),
      userId,
      userRole
    );
    res.json({ message: "Resource deleted" });
  } catch (error) {
    next(error);
  }
};

export const bulkCreateResources = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resources = await resourceService.bulkCreateResources(req.body);
    res.status(201).json(resources);
  } catch (error) {
    next(error);
  }
};

export const bulkUpdateResources = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const resources = await resourceService.bulkUpdateResources(req.body);
    res.json(resources);
  } catch (error) {
    next(error);
  }
};

export const bulkDeleteResources = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const count = await resourceService.bulkDeleteResources(req.body.ids);
    res.json({ message: "Resources deleted", count });
  } catch (error) {
    next(error);
  }
};

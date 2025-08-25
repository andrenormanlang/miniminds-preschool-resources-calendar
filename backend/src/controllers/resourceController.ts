import { Request, Response, NextFunction } from "express";
import { resourceService } from "../services/resourceService";
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
    const { approved } = req.query;

    // Convert query parameter to boolean
    let approvedFilter: boolean | undefined;
    if (approved === "true") approvedFilter = true;
    else if (approved === "false") approvedFilter = false;
    else approvedFilter = true; // Default to approved resources only

    const resources = await resourceService.getAllResources(approvedFilter);
    res.status(200).json(resources);
  } catch (error) {
    console.error("Error in getAllResources:", error);
    res.status(500).json({
      message: "Failed to fetch resources",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createResource = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, type, subject, ageGroup, description, eventDate, imageUrl } =
      req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!title || !type || !subject || !ageGroup || !eventDate) {
      return res.status(400).json({
        message:
          "Missing required fields: title, type, subject, ageGroup, eventDate",
      });
    }

    const resource = await resourceService.createResource({
      title,
      type,
      subject,
      ageGroup,
      description,
      eventDate,
      imageUrl,
      userId,
    });

    res.status(201).json(resource);
  } catch (error) {
    console.error("Error in createResource:", error);
    res.status(500).json({
      message: "Failed to create resource",
      error: error instanceof Error ? error.message : "Unknown error",
    });
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

    const updatedResource = await resourceService.approveResource(resourceId);

    if (!updatedResource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    res.status(200).json(updatedResource);
  } catch (error) {
    console.error("Error in approveResource:", error);
    res.status(500).json({
      message: "Failed to approve resource",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const rejectResource = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const resourceId = parseInt(req.params.id);

    if (!resourceId || isNaN(resourceId)) {
      return res.status(400).json({ message: "Invalid resource ID" });
    }

    await resourceService.rejectResource(resourceId);

    res.status(200).json({ message: "Resource rejected and deleted" });
  } catch (error) {
    console.error("Error in rejectResource:", error);
    res.status(500).json({
      message: "Failed to reject resource",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getPendingResources = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const resources = await resourceService.getPendingResources();
    res.status(200).json(resources);
  } catch (error) {
    console.error("Error in getPendingResources:", error);
    res.status(500).json({
      message: "Failed to fetch pending resources",
      error: error instanceof Error ? error.message : "Unknown error",
    });
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

// Update resource
export const updateResource = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const resourceId = parseInt(req.params.id);
    const updateData = req.body;

    // Check if resource exists
    const existingResource = await resourceService.getResourceById(resourceId);
    if (!existingResource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Check if user owns the resource or is superAdmin
    if (
      req.user?.role !== "superAdmin" &&
      existingResource.userId !== req.user?.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    const updatedResource = await prisma.resource.update({
      where: { id: resourceId },
      data: {
        title: updateData.title,
        description: updateData.description,
        type: updateData.type,
        subject: updateData.subject,
        ageGroup: updateData.ageGroup,
        eventDate: updateData.eventDate ? new Date(updateData.eventDate) : undefined,
        imageUrl: updateData.imageUrl,
      },
    });

    res.json(updatedResource);
  } catch (error) {
    next(error);
  }
};

// Delete resource
export const deleteResource = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const resourceId = parseInt(req.params.id);

    // Check if resource exists
    const existingResource = await resourceService.getResourceById(resourceId);
    if (!existingResource) {
      return res.status(404).json({ message: "Resource not found" });
    }

    // Check if user owns the resource or is superAdmin
    if (
      req.user?.role !== "superAdmin" &&
      existingResource.userId !== req.user?.id
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    await prisma.resource.delete({
      where: { id: resourceId },
    });

    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    next(error);
  }
};

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface CreateResourceData {
  title: string;
  type: string;
  subject: string;
  ageGroup: string;
  description?: string;
  eventDate: string;
  imageUrl?: string;
  userId: number;
}

export class ResourceService {
  // Get all resources - if approved is true, only return approved resources
  async getAllResources(approved?: boolean) {
    try {
      const whereClause =
        approved !== undefined ? { isApproved: approved } : {};

      const resources = await prisma.resource.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return resources;
    } catch (error) {
      console.error("Error fetching resources:", error);
      throw new Error("Failed to fetch resources");
    }
  }

  async createResource(data: CreateResourceData) {
    try {
      const resource = await prisma.resource.create({
        data: {
          ...data,
          eventDate: new Date(data.eventDate),
          isApproved: false, // New resources start as unapproved
        },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return resource;
    } catch (error) {
      console.error("Error creating resource:", error);
      throw new Error("Failed to create resource");
    }
  }

  async approveResource(id: number) {
    try {
      const resource = await prisma.resource.update({
        where: { id },
        data: { isApproved: true },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return resource;
    } catch (error) {
      console.error("Error approving resource:", error);
      throw new Error("Failed to approve resource");
    }
  }

  async rejectResource(id: number) {
    try {
      await prisma.resource.delete({
        where: { id },
      });
    } catch (error) {
      console.error("Error rejecting resource:", error);
      throw new Error("Failed to reject resource");
    }
  }

  async getResourceById(id: number) {
    try {
      const resource = await prisma.resource.findUnique({
        where: { id },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            },
          },
        },
      });

      return resource;
    } catch (error) {
      console.error("Error fetching resource:", error);
      throw new Error("Failed to fetch resource");
    }
  }

  async getPendingResources() {
    return this.getAllResources(false);
  }

  async getApprovedResources() {
    return this.getAllResources(true);
  }

  async getUserResources(userId: number) {
    try {
      return await prisma.resource.findMany({
        where: { userId },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (error) {
      console.error("Error fetching user resources:", error);
      throw new Error("Failed to fetch user resources");
    }
  }
}

export const resourceService = new ResourceService();

// Legacy exports for backward compatibility
export const getAllResources = (approvedOnly = true) =>
  resourceService.getAllResources(approvedOnly);
export const getPendingResources = () => resourceService.getPendingResources();
export const getUserResources = (userId: number) =>
  resourceService.getUserResources(userId);
export const getResourceById = (id: number) =>
  resourceService.getResourceById(id);
export const createResource = (data: CreateResourceData) =>
  resourceService.createResource(data);
export const approveResource = (id: number) =>
  resourceService.approveResource(id);
export const rejectResource = (id: number) =>
  resourceService.rejectResource(id);

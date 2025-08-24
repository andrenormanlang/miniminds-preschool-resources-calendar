import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all resources - if approved is true, only return approved resources
export const getAllResources = async (approvedOnly = true) => {
  const where = approvedOnly ? { isApproved: true } : {};
  return prisma.resource.findMany({
    where,
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
    orderBy: { createdAt: "desc" },
  });
};

// Get resources that are pending approval
export const getPendingResources = async () => {
  return prisma.resource.findMany({
    where: { isApproved: false },
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
    orderBy: { createdAt: "desc" },
  });
};

// Get resources created by a specific user
export const getUserResources = async (userId: number) => {
  return prisma.resource.findMany({
    where: { userId },
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
    orderBy: { createdAt: "desc" },
  });
};

// Get a single resource by ID
export const getResourceById = async (id: number) => {
  return prisma.resource.findUnique({
    where: { id },
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
};

// Create a new resource
export const createResource = async (
  data: any,
  userId: number | undefined,
  autoApprove: boolean
) => {
  // Ensure eventDate is properly formatted as ISO datetime
  const eventDate = data.eventDate
    ? new Date(data.eventDate).toISOString()
    : new Date().toISOString(); // Default to current date if not provided

  return prisma.resource.create({
    data: {
      title: data.title,
      type: data.type,
      subject: data.subject,
      ageGroup: data.ageGroup,
      description: data.description,
      eventDate: eventDate,
      imageUrl: data.imageUrl,
      isApproved: autoApprove, // Only auto-approve if superAdmin
      userId, // Link to the creating user
    },
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
};

// Update a resource - with permission checking
export const updateResource = async (
  id: number,
  data: any,
  userId: number | undefined,
  userRole: string,
  maintainApprovalStatus = false
) => {
  // First, get the resource to check ownership
  const resource = await prisma.resource.findUnique({ where: { id } });

  if (!resource) {
    throw new Error("Resource not found");
  }

  // Check permissions - admin can only update their own resources
  if (userRole === "admin" && resource.userId !== userId) {
    throw new Error("You can only edit your own resources");
  }

  // Determine approval status
  let isApproved;

  if (maintainApprovalStatus) {
    // Keep the existing approval status when admin edits their own resource
    isApproved = resource.isApproved;
  } else {
    // Default behavior: superAdmin edits are auto-approved, others need approval
    isApproved = userRole === "superAdmin" ? true : false;
  }

  // Format the eventDate if it exists
  const eventDate = data.eventDate
    ? new Date(data.eventDate).toISOString()
    : new Date().toISOString(); // Default to current date if not provided

  return prisma.resource.update({
    where: { id },
    data: {
      title: data.title,
      type: data.type,
      subject: data.subject,
      ageGroup: data.ageGroup,
      description: data.description,
      eventDate,
      imageUrl: data.imageUrl,
      isApproved,
    },
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
};

// Approve or reject a resource
export const approveResource = async (id: number, approved: boolean) => {
  return prisma.resource.update({
    where: { id },
    data: { isApproved: approved },
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
};

// Delete a resource - with permission checking
export const deleteResource = async (
  id: number,
  userId: number | undefined,
  userRole: string
) => {
  // First, get the resource to check ownership
  const resource = await prisma.resource.findUnique({ where: { id } });

  if (!resource) {
    throw new Error("Resource not found");
  }

  // Check permissions - admin can only delete their own resources
  if (userRole === "admin" && resource.userId !== userId) {
    throw new Error("You can only delete your own resources");
  }

  return prisma.resource.delete({ where: { id } });
};

// Bulk operations - superAdmin only
export const bulkCreateResources = async (resources: any[]) => {
  return prisma.$transaction(
    resources.map((resource) => prisma.resource.create({ data: resource }))
  );
};

export const bulkUpdateResources = async (resources: any[]) => {
  return prisma.$transaction(
    resources.map((resource) =>
      prisma.resource.update({
        where: { id: resource.id },
        data: resource,
      })
    )
  );
};

export const bulkDeleteResources = async (ids: number[]) => {
  return prisma.resource.deleteMany({
    where: { id: { in: ids } },
  });
};

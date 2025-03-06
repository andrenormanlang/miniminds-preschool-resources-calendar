export const updateResource = async (
  id,
  data,
  userId,
  userRole,
  maintainApprovalStatus = false
) => {
  // Check if resource exists
  const resource = await prisma.resource.findUnique({
    where: { id },
  });

  if (!resource) {
    throw new Error("Resource not found");
  }

  // Check permissions
  if (userRole !== "superAdmin" && resource.userId !== userId) {
    throw new Error("You don't have permission to update this resource");
  }

  // Determine approval status
  let isApproved;

  if (maintainApprovalStatus) {
    // Keep the existing approval status
    isApproved = resource.isApproved;
  } else {
    // Default behavior: superAdmin edits are auto-approved, others need approval
    isApproved = userRole === "superAdmin";
  }

  // Update the resource
  return prisma.resource.update({
    where: { id },
    data: {
      ...data,
      isApproved,
      // Don't update userId - keep the original creator
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

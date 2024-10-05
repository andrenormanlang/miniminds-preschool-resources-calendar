import { PrismaClient, Resource } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllResources = async (): Promise<Resource[]> => {
  return await prisma.resource.findMany();
};

export const getResourceById = async (id: number): Promise<Resource | null> => {
  return await prisma.resource.findUnique({ where: { id } });
};

export const createResource = async (data: any): Promise<Resource> => {
  return await prisma.resource.create({
    data: {
      ...data,
      eventDate: data.eventDate ? new Date(data.eventDate) : null,
      rating: Number(data.rating),
    },
  });
};

export const updateResource = async (id: number, data: any): Promise<Resource> => {
  return await prisma.resource.update({
    where: { id },
    data: {
      ...data,
      eventDate: data.eventDate ? new Date(data.eventDate) : undefined,
      rating: data.rating ? Number(data.rating) : undefined,
    },
  });
};

export const deleteResource = async (id: number): Promise<void> => {
  await prisma.resource.delete({ where: { id } });
};

export const bulkCreateResources = async (resources: any[]): Promise<Resource[]> => {
  await prisma.resource.createMany({
    data: resources.map((resource) => ({
      ...resource,
      eventDate: new Date(resource.eventDate),
    })),
  });

  // Return the created resources
  return await prisma.resource.findMany({
    where: {
      OR: resources.map((resource) => ({
        title: resource.title,
        eventDate: new Date(resource.eventDate),
      })),
    },
    orderBy: { id: 'asc' },
  });
};

export const bulkUpdateResources = async (updates: any[]): Promise<Resource[]> => {
  const updatePromises = updates.map(async (resource) => {
    return prisma.resource.update({
      where: { id: resource.id },
      data: {
        ...resource,
        eventDate: resource.eventDate ? new Date(resource.eventDate) : undefined,
      },
    });
  });

  return await Promise.all(updatePromises);
};

export const bulkDeleteResources = async (ids: number[]): Promise<number> => {
  const result = await prisma.resource.deleteMany({
    where: { id: { in: ids } },
  });
  return result.count;
};



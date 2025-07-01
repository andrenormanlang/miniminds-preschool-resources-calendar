import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteAllResources = async () => {
  console.log('Starting cleanup...');

  try {
    // Delete all resources from the database
    const deleteResult = await prisma.resource.deleteMany({});
    console.log(`Deleted ${deleteResult.count} resources from the database.`);

    // Delete all images from Cloudinary
    const { resources } = await cloudinary.api.resources({ type: 'upload', prefix: 'miniminds/' });
    const publicIds = resources.map((file) => file.public_id);

    if (publicIds.length > 0) {
      await cloudinary.api.delete_resources(publicIds);
      console.log(`Deleted ${publicIds.length} images from Cloudinary.`);
    }

    console.log('Cleanup complete!');
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
};

deleteAllResources();

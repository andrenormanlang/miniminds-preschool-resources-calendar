import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();

async function createSuperAdmin() {
  try {
    // Replace with your actual Clerk user ID - find this in your Clerk dashboard
    const clerkId = 'user_2tiozNdnW17gxlC8uNuzsyQdCwS';
    const email = 'andrenormanlang@gmail.com';
    
    const superAdmin = await prisma.user.upsert({
      where: { email },
      update: {
        role: 'superAdmin',
        isApproved: true
      },
      create: {
        clerkId,
        email,
        firstName: 'Super',
        lastName: 'Admin',
        role: 'superAdmin',
        isApproved: true
      }
    });
    
    console.log('SuperAdmin created or updated:', superAdmin);
  } catch (error) {
    console.error('Error creating superAdmin:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSuperAdmin();
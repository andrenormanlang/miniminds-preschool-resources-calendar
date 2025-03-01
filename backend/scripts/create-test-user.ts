import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// TO TEST BELOW CODE:
// npx tsx scripts/create-test-user.ts


dotenv.config();
const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Create an admin user
    const admin = await prisma.user.upsert({
      where: { email: 'admin@example.com' },
      update: {},
      create: {
        clerkId: 'clerk_test_admin',
        email: 'admin@example.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        isApproved: true
      }
    });
    
    console.log('Admin user created:', admin);
    
    // Create a regular user
    const user = await prisma.user.upsert({
      where: { email: 'user@example.com' },
      update: {},
      create: {
        clerkId: 'clerk_test_user',
        email: 'user@example.com',
        firstName: 'Regular',
        lastName: 'User',
        role: 'user',
        isApproved: false
      }
    });
    
    console.log('Regular user created:', user);
    
  } catch (error) {
    console.error('Error creating test users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
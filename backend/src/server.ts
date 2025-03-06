import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import chalk from 'chalk';
import resourceRoutes from './routes/resources.js';
import userRoutes from './routes/users.js';
import errorHandler from './middlewares/errorHandler.js';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { Webhook, WebhookEvent } from 'svix';
import bodyParser from 'body-parser'; // Fixed the typo here

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
// Special handling for webhook route to preserve raw body
app.use('/api/webhooks', bodyParser.raw({ type: 'application/json' }));
// Standard JSON parsing for all other routes
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/resources', resourceRoutes);
app.use('/api/users', userRoutes);

// Webhook route
// Modify the webhook route (lines ~87-128)

// Webhook route
app.post('/api/webhooks', async (req, res) => {
  try {
    // Convert raw body buffer to string
    const payload = req.body.toString();
    const svixHeaders = req.headers;
    
    // Get the webhook signing secret from environment variables
    const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
      console.error('Missing CLERK_WEBHOOK_SECRET');
      return res.status(500).json({
        success: false, 
        message: 'Server configuration error'
      });
    }

    // Create a new Webhook instance with your secret
    const webhook = new Webhook(webhookSecret);
    
    // Verify the webhook signature
    const evt: any = webhook.verify(payload, {
      'svix-id': svixHeaders['svix-id'] as string,
      'svix-timestamp': svixHeaders['svix-timestamp'] as string,
      'svix-signature': svixHeaders['svix-signature'] as string
    });
    
    const { id, ...attributes } = evt.data;
    const eventType = evt.type;
    
    console.log(`Webhook received: ${eventType} for user ${id}`);
    
    // Process different event types
    if (eventType === 'user.created') {
      console.log(`Creating user with ID: ${id}`);
      
      // Extract email from the first email address in the array
      const email = attributes.email_addresses?.[0]?.email_address;
      
      if (!email) {
        console.error('No email found in webhook data');
        return res.status(400).json({
          success: false,
          message: 'No email found in webhook data'
        });
      }
      
      // Create the user in your database
      const user = await prisma.user.create({
        data: {
          clerkId: id,
          email: email,
          firstName: attributes.first_name || null,
          lastName: attributes.last_name || null,
          role: 'user', // Default role
          isApproved: false // Default approval status
        }
      });
      
      console.log(`User created with ID: ${user.id}`);
    } 
    else if (eventType === 'user.updated') {
      console.log(`Updating user with ID: ${id}`);
      
      // Extract email from the first email address in the array
      const email = attributes.email_addresses?.[0]?.email_address;
      
      if (!email) {
        console.error('No email found in webhook data');
        return res.status(400).json({
          success: false,
          message: 'No email found in webhook data'
        });
      }
      
      // Check if user exists before updating
      const existingUser = await prisma.user.findUnique({
        where: { clerkId: id }
      });
      
      if (existingUser) {
        // Update the user in your database
        const user = await prisma.user.update({
          where: { clerkId: id },
          data: {
            email: email,
            firstName: attributes.first_name || null,
            lastName: attributes.last_name || null
          }
        });
        
        console.log(`User updated with ID: ${user.id}`);
      } else {
        // Create the user if it doesn't exist
        const user = await prisma.user.create({
          data: {
            clerkId: id,
            email: email,
            firstName: attributes.first_name || null,
            lastName: attributes.last_name || null,
            role: 'user',
            isApproved: false
          }
        });
        
        console.log(`User created during update with ID: ${user.id}`);
      }
    } 
    else if (eventType === 'user.deleted') {
      console.log(`Deleting user with ID: ${id}`);
      
      // Check if the user exists before deleting
      const existingUser = await prisma.user.findUnique({
        where: { clerkId: id }
      });
      
      if (existingUser) {
        // Delete the user from your database
        await prisma.user.delete({
          where: { clerkId: id }
        });
        console.log(`User deleted with ID: ${existingUser.id}`);
      } else {
        // No need to delete if user doesn't exist
        console.log(`User with clerk ID ${id} not found in database, skipping deletion`);
      }
    }

    // Return a success response
    return res.status(200).json({
      success: true,
      message: 'Webhook processed successfully'
    });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return res.status(400).json({
      success: false,
      message: 'Webhook verification failed',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
});

// Error Handling Middleware
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(chalk.green(`🚀 Server is running on port ${chalk.blue(PORT)}`));
});

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log(chalk.yellow('🛑 SIGTERM received. Shutting down gracefully...'));
  await prisma.$disconnect();
  console.log(chalk.yellow('📵disconnected from database.'));
  process.exit(0);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error(chalk.red('🚨 Unhandled Rejection at:', promise, 'reason:', reason));
  // Application specific logging, throwing an error, or other logic here
});
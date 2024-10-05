import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import chalk from 'chalk';
import resourceRoutes from './routes/resources.js';
import errorHandler from './middlewares/errorHandler.js';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/resources', resourceRoutes);

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
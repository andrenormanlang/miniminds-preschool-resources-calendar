const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const debug = require('debug')('app:server');
const morgan = require('morgan');
const prisma = new PrismaClient();
const app = express();

// Middleware for enabling CORS and parsing JSON
app.use(cors({
  origin: 'http://localhost:3000',
}));
app.use(express.json());
app.use(morgan('dev'));

// Dynamically import supports-color since it's an ES module
async function loadSupportsColor() {
  const { createSupportsColor } = await import('supports-color');
  const supportsColor = createSupportsColor(process.stdout);

  if (supportsColor) {
    console.log('\x1b[36m%s\x1b[0m', 'Terminal supports color!');
  } else {
    console.log('Terminal does not support color.');
  }
}

loadSupportsColor();

// Route to get all resources
app.get('/api/resources', async (req, res) => {
  debug('Fetching all resources');
  const resources = await prisma.resource.findMany();
  res.json(resources);
});

// Route to create a resource with validation
app.post(
  '/api/resources',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('type').notEmpty().withMessage('Type is required'),
    body('subject').notEmpty().withMessage('Subject is required'),
    body('ageGroup').notEmpty().withMessage('Age group is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('description').notEmpty().withMessage('Description is required'),
    body('eventDate').notEmpty().withMessage('Event date is required').isISO8601().withMessage('Event date must be a valid ISO8601 date format'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, type, subject, ageGroup, rating, link } = req.body;
    const resource = await prisma.resource.create({
      data: { title, type, subject, ageGroup, rating, link },
    });
    res.json(resource);
  }
);

// Bulk route to create multiple resources
app.post('/api/resources/bulk', async (req, res) => {
  const resources = req.body;

  if (!Array.isArray(resources)) {
    return res.status(400).json({ message: 'Data must be an array of resources.' });
  }

  try {
    const createdResources = await prisma.resource.createMany({
      data: resources,
    });
    res.json({ message: 'Resources created successfully', count: createdResources.count });
  } catch (error) {
    res.status(500).json({ message: 'Error creating resources', error: error.message });
  }
});

// Route to update a resource
app.put('/api/resources/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedResource = await prisma.resource.update({
      where: { id: parseInt(id) },
      data,
    });
    res.json(updatedResource);
  } catch (error) {
    res.status(500).json({ message: 'Error updating resource', error: error.message });
  }
});

// Bulk route to update multiple resources
app.post('/api/resources/bulk-update', async (req, res) => {
  const updates = req.body; // Expecting an array of objects, each containing an `id` and the data to update

  if (!Array.isArray(updates)) {
    return res.status(400).json({ message: 'Data must be an array of updates.' });
  }

  try {
    const updatePromises = updates.map(async (resource) => {
      // Check if the resource exists before updating
      const existingResource = await prisma.resource.findUnique({
        where: { id: parseInt(resource.id) },
      });

      if (!existingResource) {
        // Log an error if the resource doesn't exist
        console.log(`Resource with id ${resource.id} not found.`);
        throw new Error(`Resource with id ${resource.id} not found.`);
      }

      // Proceed with the update if the resource exists
      return prisma.resource.update({
        where: { id: parseInt(resource.id) },  // Ensure id is parsed correctly
        data: {
          title: resource.title,
          type: resource.type,
          subject: resource.subject,
          ageGroup: resource.ageGroup,
          rating: resource.rating,
          description: resource.description,
          eventDate: resource.eventDate,
          imageUrl: resource.imageUrl,
        },
      });
    });

    const updatedResources = await Promise.all(updatePromises);
    res.json({ message: 'Resources updated successfully', updatedResources });
  } catch (error) {
    console.error('Error updating resources:', error.message);
    res.status(500).json({ message: 'Error updating resources', error: error.message });
  }
});


// Route to delete a resource
app.delete('/api/resources/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.resource.delete({
      where: { id: parseInt(id) },
    });
    res.json({ message: 'Resource deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting resource', error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  debug(`Server running on port ${PORT}`);
});

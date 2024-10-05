import { Router, Request, Response } from 'express';
import {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  bulkCreateResources,
  bulkUpdateResources,
  bulkDeleteResources,
} from '../controllers/resourceController.js';
import multer from 'multer';
import { storage } from '../utils/cloudinary.js';

const router = Router();

router.get('/', getAllResources);
router.get('/:id', getResourceById);
router.post('/', createResource);
router.put('/:id', updateResource);
router.delete('/:id', deleteResource);

// Bulk operations
router.post('/bulk', bulkCreateResources);
router.post('/bulk-update', bulkUpdateResources);
router.delete('/', bulkDeleteResources);

const upload = multer({ storage });

router.post(
  '/upload',
  upload.single('image'),
  async (req: Request, res: Response) => {
    if (req.file && req.file.path) {
      res.json({ imageUrl: req.file.path });
    } else {
      res.status(400).json({ message: 'No file uploaded' });
    }
  }
);

export default router;


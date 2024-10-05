import { Router } from 'express';
import {
  getAllResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  bulkCreateResources,
  bulkUpdateResources,
  bulkDeleteResources
} from '../controllers/resourceController.js';

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

export default router;

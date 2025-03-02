import { Router } from 'express';
import { 
  createOrUpdateUser, 
  approveUser, 
  setUserRole, 
  getAllUsers, 
  syncClerkUser,
  getCurrentUser, 
  manualCreateUser 
} from '../controllers/userController.js';

import { isSuperAdmin, isAdminOrSuperAdmin, requireAuth } from '../middlewares/auth.js';


const router = Router();

// Public route to create/update user on sign-in
router.post('/', createOrUpdateUser);
router.post('/sync', syncClerkUser);

router.get('/current', requireAuth, getCurrentUser);

// SuperAdmin only routes
router.get('/', isSuperAdmin, getAllUsers);
router.patch('/:id/approve', isSuperAdmin, approveUser);
router.patch('/:id/role', isSuperAdmin, setUserRole);

// For testing only
router.post('/manual-create', manualCreateUser); 

export default router;
import { Router } from 'express';
import { createOrUpdateUser, approveUser, setUserRole, getAllUsers, syncClerkUser, manualCreateUser } from '../controllers/userController.js';
import { isAdmin } from '../middlewares/auth.js';

const router = Router();

// Public route to create/update user on sign-in
router.post('/', createOrUpdateUser);

// Admin only routes
router.get('/', isAdmin, getAllUsers);
router.patch('/:id/approve', isAdmin, approveUser);
router.patch('/:id/role', isAdmin, setUserRole);

// Sync user from Clerk 
router.post('/sync', syncClerkUser);

// For testing only
router.post('/manual-create', manualCreateUser); 

export default router;